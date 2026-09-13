export function getPaginationWindow(total: number, requestedPage: number, pageSize: number) {
  const totalPages = Math.ceil(total / pageSize);
  const page = Math.min(requestedPage, Math.max(totalPages, 1));

  return {
    offset: (page - 1) * pageSize,
    page,
    totalPages,
  };
}
