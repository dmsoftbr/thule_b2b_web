# Code Review — finish-order-modal.tsx

---

## 1. Mutação direta do state (BUG)

Vários trechos mutam `order` diretamente antes de chamar `setOrder`, o que pode causar re-renders inconsistentes ou que não acontecem, já que o React compara referências.

| Linha | Código problemático |
|-------|-------------------|
| 345–346 | `order.discountPercentual = newPercentual; setOrder({ ...order });` |
| 393–394 | `order.freightValue = ...; setFreightsData(...); setOrder({...order, ...})` |
| 562–564 | `order.whatAppPhoneNumber = value ?? ""; setOrder(order);` — pior caso: passa a **mesma referência**, React pode ignorar o update |
| 753–756 | `order.carrierId = carrierId; order.freightValue = value; setOrder({ ...order });` |
| 831–837 | `order.additionalDiscount = ...; setOrder({ ...order });` |

**Correção:** Sempre criar um novo objeto sem mutar o anterior:
```ts
setOrder({ ...order, discountPercentual: newPercentual });
```

---

## 2. `.map()` usado como `.forEach()` (linhas 95–187)

`orderData.items.map(...)` é usado apenas pelo side-effect (push em `taxes`). `.map()` cria um array que é descartado.

**Correção:** Trocar por `.forEach()` ou construir o array de taxes com `.flatMap()`.

---

## 3. `useEffect(() => getTaxes(), [order])` — chamadas excessivas (linha 508–510)

`order` é um objeto — toda vez que qualquer campo muda (inclusive campos irrelevantes para impostos), `getTaxes` é chamado. Como `setOrder` cria um novo objeto a cada interação, isso gera chamadas de API a cada keystroke/checkbox.

**Correção:** Usar dependências mais específicas (ex: `order.items`, `order.freightValue`, `order.discountPercentual`) ou debounce.

---

## 4. `getTaxes` sem AbortController

`getFreights` já tem cancelamento, mas `getTaxes` não. Como é disparado a cada mudança de `order`, múltiplas requisições podem ficar em voo ao mesmo tempo.

**Correção:** Aplicar o mesmo padrão de `AbortController` + ref usado em `getFreights`.

---

## 5. `getTaxes` — early return após `setIsCalculatingTaxes(true)` (linhas 415–418)

Se `!isEditing` ou `items.length == 0`, a função retorna mas `isCalculatingTaxes` fica `true` para sempre (o `finally` executa, mas o pattern é frágil se o fluxo mudar).

**Correção:** Mover as guards para antes de `setIsCalculatingTaxes(true)`.

---

## 6. Bloco `if` vazio (linhas 498–504)

```ts
if (order.customer.minValuePayedFreight > 0 && ...) {
  // vazio
}
```

Código morto — confunde quem lê, parece incompleto.

**Correção:** Implementar a lógica (ex: setar validationMessage) ou remover o bloco.

---

## 7. Condição com `??` incorreta (linhas 809–812)

```ts
((order.orderClassificationId != 6 &&
  (selectedPaymentCondition?.additionalDiscountPercent ?? 0) > 0) ??
  0 > 0)
```

O `??` aqui recebe um `boolean` do lado esquerdo — `boolean ?? 0 > 0` nunca cai no fallback porque `false` não é `null`/`undefined`. O `?? 0 > 0` é código morto.

**Correção:** Remover o `?? 0 > 0`:
```ts
(order.orderClassificationId != 6 &&
  (selectedPaymentCondition?.additionalDiscountPercent ?? 0) > 0)
```

---

## 8. Tag HTML malformada (linha 205)

```
<b>pedidos.itupeva@thule.com<b/>
```

Deveria ser `</b>` (closing tag).

---

## 9. Duplo clique no "Enviar Pedido" (handleSendOrder)

`setIsSaving(true)` é chamado dentro do `try`, mas se o usuário clicar rapidamente duas vezes, duas chamadas de API podem ser disparadas em paralelo.

**Correção:** Desabilitar o botão com `isSaving` (já existe no botão "Enviar/Gerar Pedido", mas o botão "Gravar Simulação" na linha 890 não verifica `isSaving`).

---

## 10. `console.log` esquecidos

| Linha | Log |
|-------|-----|
| 321 | `console.log("PERMISSIONS", data)` |
| 237 | `console.log(error)` |
| 397 | `console.log(error)` (no getFreights) |
| 453 | `console.log(error)` (no getTaxes) |

**Correção:** Remover ou substituir por logging estruturado.

---

## 11. Valores de `Select` e `Checkbox` não sincronizam com `order`

- **Tipo do Pedido** (linha 529): usa `defaultValue` — não atualiza se `orderClassificationId` mudar. Deveria usar `value` + `onValueChange` e gravar no order.
- **Estabelecimento** (linha 607): mesmo problema com `defaultValue`. Valor selecionado nunca é salvo no `order.branchId`.
- **Nº Pedido Distribuidor** (linha 554): `<Input>` sem `value` nem `onChange` — valor digitado é perdido.
- **Faturar em / Faturar no Máximo até** (linhas 630, 636): `<DatePicker>` sem `value`/`onChange` — datas selecionadas nunca são persistidas em `order`.
- **Importadora** (linha 621): `<Checkbox>` sem `checked`/`onCheckedChange` — estado perdido.

**Correção:** Conectar cada campo ao state do `order` com `value` + handler de mudança.

---

## 12. Typo no texto (linha 746)

`Caculando Frete` → `Calculando Frete`

---

## 13. Typo na classe CSS (linha 877)

`text-whit` → `text-white`

---

## Resumo por severidade

| Severidade | Item |
|-----------|------|
| **Bug** | #1 (mutação direta), #7 (condição ??), #8 (tag HTML), #11 (campos desconectados) |
| **Performance** | #3 (getTaxes a cada render), #4 (sem abort em getTaxes) |
| **Code smell** | #2 (map como forEach), #6 (if vazio), #10 (console.log) |
| **UX** | #5 (loading infinito), #9 (duplo clique simulação), #12 e #13 (typos) |
