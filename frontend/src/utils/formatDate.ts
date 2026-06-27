const formatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
});

export function formatDate(iso: string): string {
  return formatter.format(new Date(iso));
}
