# Coding standards

- 2 spaces for indentation
- UNIX-style newlines (\n)
- No trailing spaces
- Limit your lines to 120 characters
- Use semicolons after commands
- Use single quotes
- Use `const` and `let` for variable declarations instead of `var`
- Try not to use `import * from ...`
- Put opening braces on the same line as `if`/`while`/`for-each`/... statements

```js
if (condition) {
  ...
}
```

- Use snake_case for directory/file names
- Use lowerCamelCase for variable/function names
- Use UpperCamelCase for class, interface and type names
- Use UPPERCASE for constants
- Use trailing commas

```js
{
  key1: 'value1',
  key2: 'value2',
}
```

- Declare one variable per var statement

```js
const variableA = 42;
const variableB = 'foo';
```

- Do not use `==` and `!=` conditions
- Try to write functions as small as possible
- Return early from functions (do not nest deeply)

```js
function isPercentage(val) {
  if (val < 0) {
    return false;
  }
  if (val > 100) {
    return false;
  }
  return true;
}
```

- When a file contains a lot of functions divide it into smaller files
- Mark function as `async` when it returns a promise
- Use `async`/`await` instead of callbacks (when possible)
- Catch unhandled promise rejections
- Use arrow functions
- When an error is thrown, it should be instance of the `Error` object.
- Write JSDocs whenever it's meaningful
- Omit comments that are redundant with TypeScript (e.g. do not declare types in @param and @return blocks)
- If a class member is not initialized with a constructor parameter, initialize it where it's declared
- A getter function must be a pure function
- Avoid using `any` type

# Files structure

- Put unit tests into `__tests__` folder within the folder where the tested file is located
- Unit tests have to have `*.test.ts` suffix
