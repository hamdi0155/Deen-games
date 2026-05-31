import html2canvas from 'html2canvas';

export async function exportAsPNG(elementId: string, filename = 'avatar.png'): Promise<void> {
  const el = document.getElementById(elementId);
  if (!el) return;
  const canvas = await html2canvas(el, { backgroundColor: null, scale: 3 });
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export async function exportAsSVG(svgElementId: string, filename = 'avatar.svg'): Promise<void> {
  const el = document.getElementById(svgElementId);
  if (!el || el.tagName !== 'svg') return;
  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(el);
  const blob = new Blob([svgStr], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

export async function exportAsGIF(_elementId: string, _filename = 'avatar.gif'): Promise<void> {
  alert('Animated GIF export coming soon! Use PNG export for now.');
}

export async function exportAsSticker(elementId: string): Promise<void> {
  await exportAsPNG(elementId, 'avatar-sticker.png');
}
