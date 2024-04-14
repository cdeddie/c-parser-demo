var editor;

require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.26.1/min/vs' }});
require(["vs/editor/editor.main"], () => {
  editor = monaco.editor.create(document.getElementById('monaco-editor'), {
    value: `int main() { return 0; }`,
    language: 'cpp',
    theme: 'vs-light',
  });
});

const fetchHTML = async() => {
  try {
    const code = editor.getValue();
    const encodedCode = encodeURIComponent(code);
    const url = `http://3.27.222.147:3001/parse?code=${encodedCode}`;

    const response = await fetch(url);
    if (response.status === 500) {
      const errorMessage = await response.text();
      throw new Error(`${errorMessage}`);
    }


    const data = await response.text();
    document.getElementById('ast').innerHTML = data;
  } catch(error) {
    console.error("Error fetching HTML", error.message);
    document.getElementById('ast').innerHTML = `${error.message}`;
  }
};

document.getElementById('parse-button').addEventListener('click', fetchHTML);