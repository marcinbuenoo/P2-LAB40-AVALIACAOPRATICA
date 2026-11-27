const test = require("node:test");
const assert = require("node:assert/strict");
const feature = require("../src/features/feature14");

test("reconhece palíndromos ignorando caixa e espaços", () => {
  assert.deepEqual(feature.execute({ texto: "A sacada da casa" }), {
    palindromo: true,
  });
  assert.deepEqual(feature.execute({ texto: "Ovo" }), { palindromo: true });
});

test("ignora pontuação e acentos", () => {
  assert.deepEqual(
    feature.execute({ texto: "A man, a plan, a canal: Panama" }),
    { palindromo: true },
  );
  assert.deepEqual(feature.execute({ texto: "Árá" }), { palindromo: true });
});

test("identifica texto que não é palíndromo", () => {
  assert.deepEqual(feature.execute({ texto: "FATEC" }), { palindromo: false });
});

test("rejeita dados inválidos", () => {
  assert.throws(() => feature.execute({ texto: 123 }), Error);
  assert.throws(() => feature.execute({ texto: "   !!!" }), Error);
  assert.throws(() => feature.execute(), Error);
});
