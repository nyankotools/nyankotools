export const CONTACT_EMAIL = 'nyankotools@gmail.com';

export interface ContactFormValues {
  category: string;
  name: string;
  message: string;
}

export interface ContactFormLabels {
  categoryLabel: string;
  nameLabel: string;
}

export function formatMailBody(
  values: ContactFormValues,
  labels: ContactFormLabels,
): string {
  const lines = [`${labels.categoryLabel}: ${values.category}`];
  const trimmedName = values.name.trim();
  if (trimmedName) {
    lines.push(`${labels.nameLabel}: ${trimmedName}`);
  }
  lines.push('', values.message.trim());
  return lines.join('\n');
}

export function buildMailtoLink(
  values: ContactFormValues,
  labels: ContactFormLabels,
  subjectPrefix: string,
): string {
  const subject = `${subjectPrefix}${values.category}`;
  const body = formatMailBody(values, labels)
    .replace(/\r\n|\r/g, '\n')
    .replace(/\n/g, '\r\n');
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
