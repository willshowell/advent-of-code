const day = Deno.args[0];
const isValidDay = isFinite(+day) && +day > 0 && +day < 32;
if (!isValidDay) {
  throw Error("Invalid argument for day");
}

const importPath = `./${day}/index.ts`;

try {
  console.log(`Executing ${importPath}...\n`);
  await import(importPath);
} catch (err) {
  if (err.message.includes("Module not found")) {
    console.log(`It doesn't look like day ${day} exists`);
  } else {
    throw err;
  }
}
