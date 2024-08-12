import { validateRUT } from "./pages/index/validateRut";

test("Estos tendrian que ser RUT válidos", () => {
    expect(validateRUT("21224626-3")).toBe(true);
    expect(validateRUT("11111111-1")).toBe(true);
    expect(validateRUT("20489922-3")).toBe(true);
});

test("Estos tendrian que ser rut invalidos", () => {
    expect(validateRUT("12345678-K")).toBe(false);
    expect(validateRUT("111111111")).toBe(false);
    expect(validateRUT("2.111.111-1")).toBe(false);
    expect(validateRUT("20.489.922-3")).toBe(false);
    expect(validateRUT("ab.cde.ada-3")).toBe(false);
    expect(validateRUT("31.cd3.1da-3")).toBe(false);
    expect(validateRUT("dw-4")).toBe(false);
    expect(validateRUT("dad")).toBe(false);
    expect(validateRUT("dd wdd-4")).toBe(false);
});

test("Este RUT vacio tendria que ser invalido", () => {
    expect(validateRUT("")).toBe(false);
});