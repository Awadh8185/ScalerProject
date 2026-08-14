const input = document.querySelector('#file');
const dropzone = document.querySelector('#dropzone');
const button = document.querySelector('#redact');
const label = document.querySelector('#file-label');
const status = document.querySelector('#status');

function choose(file) {
  if (!file) return;
  if (!file.name.toLowerCase().endsWith('.docx')) {
    status.textContent = 'Please choose a .docx file.';
    status.className = 'status error';
    return;
  }
  input.files = file instanceof FileList ? file : createFileList(file);
  label.textContent = file.name;
  button.disabled = false;
  status.textContent = 'Ready to redact.';
  status.className = 'status';
}

function createFileList(file) {
  const transfer = new DataTransfer();
  transfer.items.add(file);
  return transfer.files;
}

input.addEventListener('change', () => choose(input.files[0]));
['dragenter', 'dragover'].forEach(event => dropzone.addEventListener(event, e => { e.preventDefault(); dropzone.classList.add('active'); }));
['dragleave', 'drop'].forEach(event => dropzone.addEventListener(event, e => { e.preventDefault(); dropzone.classList.remove('active'); }));
dropzone.addEventListener('drop', event => choose(event.dataTransfer.files[0]));

button.addEventListener('click', async () => {
  const file = input.files[0];
  if (!file) return;
  button.disabled = true;
  button.innerHTML = 'Redacting…';
  status.textContent = 'Processing your document securely…';
  status.className = 'status';
  try {
    const data = new FormData();
    data.append('file', file);
    const response = await fetch('/api/redact', { method: 'POST', body: data });
    if (!response.ok) throw new Error((await response.json()).error || 'Processing failed.');
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `redacted_${file.name}`;
    link.click();
    URL.revokeObjectURL(link.href);
    status.textContent = `${response.headers.get('X-Redaction-Count') || 'Your'} replacements completed. Download started.`;
    status.className = 'status success';
  } catch (error) {
    status.textContent = error.message;
    status.className = 'status error';
  } finally {
    button.disabled = false;
    button.innerHTML = 'Redact and download <b>→</b>';
  }
});
