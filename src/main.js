let editor;

require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.26.1/min/vs' }});
require(["vs/editor/editor.main"], () => {
  editor = monaco.editor.create(document.getElementById('monaco-editor'), {
    value: `#include <stdio.h>

int main(void)
{
    return 0;
}
    `,
    language: 'cpp',
    theme: 'vs-light',
  });
});


// Random value for editor
let previousString = '';

function getRandomString() {
    let randomString;
    do {
        const randomIndex = Math.floor(Math.random() * codes.length);
        randomString = codes[randomIndex];
    } while (randomString === previousString);
    previousString = randomString;
    return randomString;
}


const randButton = document.getElementById('random-button');
randButton.addEventListener('click', function() {
  const randomString = getRandomString();
  editor.setValue(randomString);
});

const codes = [
`#include <stdio.h>

int main()
{
    printf("Hello world!");
    return 0;
}
`,
`#include <stdio.h>

int main()
{
    int num1 = 5;
    int num2 = 10;
    int sum;
    sum = num1 + num2;
    printf("Sum of %d and %d is: %d", num1, num2, sum);
    return 0;
}
`,
`#include <stdio.h>

int main()
{
    int num;
    printf("Enter an integer: ");
    scanf("%d", &num);
    printf("You entered: %d", num);
    return 0;
}
`,
`#include <stdio.h>

void printMessage()
{
    printf("This is a function.");
}

int main()
{
    printMessage();
    return 0;
}
`,
`#include <stdio.h>

int main()
{
    int i;
    for (i = 0; i < 5; i++) {
        printf("%d ", i);
    }
    return 0;
}
`,
`#include <stdio.h>
#include "MyFile.h"

int main()
{
    return 0;
}
`,
`#include <stdio.h>

#define MAX 100
#define MIN 10

int main()
{
    int big_array[MAX];
    int small_array[MIN];
}
`,
`#include <stdio.h>

void swap(int *a, int *b)
{
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main()
{
    int num1 = 5;
    int num2 = 7;
    swap(&num1, &num2);
}
`,
`#include <stdio.h>

int main()
{
    int num;
    printf("Enter a number: ");
    scanf("%d", &num);
    if (num > 0) {
        printf("%d is positive.", num);
    } else if (num < 0) {
        printf("%d is negative.", num);
    } else {
        printf("You entered zero.");
    }
    return 0;
}
`
];  

// Fetch HTML function
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

    const sections = data.split('\n');

    const includes = sections[0].split(':')[1].split(',');
    const macros = sections[1].split(':')[1].split(',').map(pair => pair.split('='));
    const html = sections.slice(3).join('\n');

    document.getElementById('ast').innerHTML = html;

    const includesList = document.getElementById('includes');
    includesList.innerHTML = includes.map(include => {
      const escapedInclude = include.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `<li>${escapedInclude}</li>`;
    }).join('');


    const macrosList = document.getElementById('macros');
    if (macros[0][0] !== '') {
      macrosList.innerHTML = macros.map(macro => `<li>${macro[0]} = ${macro[1]}</li>`).join('');
    } else {
      macrosList.innerHTML = '<li>No macros defined</li>';
    }
  } catch(error) {
    console.error("Error fetching HTML", error.message);
    document.getElementById('ast').innerHTML = `${error.message}`;
  }
};

document.getElementById('parse-button').addEventListener('click', fetchHTML);

// Dark mode toggle
const darkModeToggle = document.getElementById('darkmode-toggle');
const body = document.getElementById('body');

darkModeToggle.addEventListener('change', () => {
  if (darkModeToggle.checked) {
    body.classList.add('dark');
    monaco.editor.setTheme('vs-dark');
  } else {
    body.classList.remove('dark');
    monaco.editor.setTheme('vs-light');
  }
});