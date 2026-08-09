import { Button } from "@client/components/ui/button";
import { useSetSlugM, useSlug } from "@client/hooks/api";
import { cn } from "@client/lib/utils";
import { SlugSchema } from "@omnistream/packages/schemas.js";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

type Props = {
  className?: string;
};

type SlugFormValues = {
  slug: string;
};

export function SlugEditor({ className }: Props) {
  const [copied, setCopied] = useState(false);
  const slug = useSlug();

  const { formState, handleSubmit, register, reset } = useForm<SlugFormValues>({
    defaultValues: { slug },
    mode: "onChange",
  });

  const setSlugM = useSetSlugM();
  const saveSlug = async ({ slug }: SlugFormValues) => {
    await setSlugM.mutateAsync({ slug });
    reset({ slug });
    setCopied(false);
  };

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/share/${slug}`);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={cn("border-b border-[#f0eff3] p-3 sm:px-5", className)}>
      <form
        className="flex flex-col gap-2"
        onSubmit={(event) => void handleSubmit(saveSlug)(event)}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="min-w-0 grow">
            <span className="sr-only">Public video queue slug</span>
            <span className="sr-only" id="slug-help">
              Use 3–48 lowercase letters, numbers, and hyphens.
            </span>
            <div className="flex min-w-0 rounded-lg border border-[#e5e3ea] bg-[#fcfcfd] focus-within:border-violet-400 focus-within:ring-3 focus-within:ring-violet-100">
              <span className="shrink-0 border-r border-[#e5e3ea] px-2.5 py-1.5 text-sm text-[#908d9d]">
                {window.location.origin}/share/
              </span>
              <input
                autoComplete="off"
                aria-describedby="slug-help"
                aria-invalid={Boolean(formState.errors.slug)}
                className="min-w-0 grow bg-transparent px-2.5 py-1.5 text-sm text-[#353248] outline-none"
                maxLength={48}
                {...register("slug", {
                  onChange: (event) => {
                    const value = event.target.value.toLowerCase();
                    event.target.value = value.startsWith("@") ? value : `@${value}`;
                  },
                  validate: (value) =>
                    SlugSchema.safeParse(value).success ||
                    "Use @ followed by 3–47 lowercase letters, numbers, or hyphens.",
                })}
              />
            </div>
          </label>
          <div className="flex shrink-0 gap-2">
            <Button
              disabled={!formState.isValid || !formState.isDirty || setSlugM.isPending}
              size="sm"
              type="submit"
            >
              {setSlugM.isPending ? "Saving…" : "Save"}
            </Button>
            <Button onClick={() => void copyShareUrl()} size="sm" type="button" variant="outline">
              {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>
        {formState.errors.slug && (
          <p className="text-xs text-red-600" role="alert">
            {formState.errors.slug.message}
          </p>
        )}
        {setSlugM.error && (
          <p className="text-xs text-red-600" role="alert">
            {setSlugM.error.message}
          </p>
        )}
      </form>
    </div>
  );
}
