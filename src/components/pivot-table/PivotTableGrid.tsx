import { formatNumber } from "@/lib/number-utils";
import type { PivotField, PivotMatrix } from "./pivot.types";

type Props = {
  matrix: PivotMatrix;
  rowFields: PivotField[];
  columnFields: PivotField[];
};

const ROW_COL_WIDTH = 180;

function fmt(v: number | null): string {
  if (v == null) return "";
  return formatNumber(v) ?? String(v);
}

const STICKY_BORDER_SHADOW =
  "inset -1px 0 0 0 var(--border), inset 0 -1px 0 0 var(--border), inset 1px 0 0 0 var(--border), inset 0 1px 0 0 var(--border)";

function stickyStyle(index: number): React.CSSProperties {
  return {
    left: index * ROW_COL_WIDTH,
    width: ROW_COL_WIDTH,
    minWidth: ROW_COL_WIDTH,
    maxWidth: ROW_COL_WIDTH,
    boxShadow: STICKY_BORDER_SHADOW,
  };
}

export function PivotTableGrid({ matrix, rowFields, columnFields }: Props) {
  const {
    rowHeaders,
    columnHeaders,
    valueLabels,
    cells,
    rowTotals,
    columnTotals,
    grandTotals,
  } = matrix;

  const hasColumns = columnHeaders.length > 0;
  const valueCount = valueLabels.length;
  const colSpanPerColumn = valueCount;
  const totalRowColsWidth = rowFields.length * ROW_COL_WIDTH;

  return (
    <div className="border rounded-lg overflow-auto bg-card">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-muted">
          {hasColumns &&
            columnFields.map((_cf, level) => (
              <tr key={`ch-${level}`}>
                {rowFields.length > 0 &&
                  level === 0 &&
                  rowFields.map((rf, i) => (
                    <th
                      key={`rfh-${String(rf.key)}`}
                      rowSpan={columnFields.length}
                      style={stickyStyle(i)}
                      className="border px-3 py-2 text-left font-semibold bg-muted sticky z-30"
                    >
                      {rf.label}
                    </th>
                  ))}
                {columnHeaders.map((ch, ci) => (
                  <th
                    key={`ch-${level}-${ci}`}
                    colSpan={colSpanPerColumn}
                    className="border px-3 py-2 text-center font-semibold whitespace-nowrap bg-muted"
                  >
                    {ch[level] ?? ""}
                  </th>
                ))}
                {level === 0 && (
                  <th
                    rowSpan={columnFields.length + (valueCount > 1 ? 1 : 0)}
                    colSpan={valueCount}
                    className="border px-3 py-2 text-center font-semibold bg-muted"
                  >
                    Total Geral
                  </th>
                )}
              </tr>
            ))}

          {!hasColumns && (
            <tr>
              {rowFields.map((rf, i) => (
                <th
                  key={`rfh-${String(rf.key)}`}
                  style={stickyStyle(i)}
                  className="border px-3 py-2 text-left font-semibold bg-muted sticky z-30"
                >
                  {rf.label}
                </th>
              ))}
              {valueLabels.map((vl, vi) => (
                <th
                  key={`vh-${vi}`}
                  className="border px-3 py-2 text-center font-semibold whitespace-nowrap bg-muted"
                >
                  {vl}
                </th>
              ))}
            </tr>
          )}

          {hasColumns && valueCount > 1 && (
            <tr>
              {columnHeaders.map((_, ci) =>
                valueLabels.map((vl, vi) => (
                  <th
                    key={`vh-${ci}-${vi}`}
                    className="border px-3 py-1.5 text-center font-medium text-xs whitespace-nowrap bg-muted"
                  >
                    {vl}
                  </th>
                ))
              )}
            </tr>
          )}
        </thead>
        <tbody>
          {rowHeaders.length === 0 ? (
            <tr>
              <td
                colSpan={
                  rowFields.length +
                  (hasColumns ? columnHeaders.length * valueCount : valueCount) +
                  (hasColumns ? valueCount : 0)
                }
                className="border px-3 py-6 text-center text-muted-foreground"
              >
                Sem dados
              </td>
            </tr>
          ) : (
            rowHeaders.map((rh, ri) => (
              <tr key={`r-${ri}`} className="group">
                {rh.map((label, li) => (
                  <td
                    key={`rh-${ri}-${li}`}
                    style={stickyStyle(li)}
                    className="border px-3 py-1.5 font-medium whitespace-nowrap sticky z-20 bg-card group-hover:bg-muted"
                  >
                    {label}
                  </td>
                ))}
                {hasColumns
                  ? columnHeaders.map((_, ci) =>
                      valueLabels.map((_, vi) => (
                        <td
                          key={`c-${ri}-${ci}-${vi}`}
                          className="border px-3 py-1.5 text-right tabular-nums group-hover:bg-muted/40"
                        >
                          {fmt(cells[ri][ci][vi])}
                        </td>
                      ))
                    )
                  : valueLabels.map((_, vi) => (
                      <td
                        key={`c-${ri}-${vi}`}
                        className="border px-3 py-1.5 text-right tabular-nums group-hover:bg-muted/40"
                      >
                        {fmt(rowTotals[ri][vi])}
                      </td>
                    ))}
                {hasColumns &&
                  valueLabels.map((_, vi) => (
                    <td
                      key={`rt-${ri}-${vi}`}
                      className="border px-3 py-1.5 text-right tabular-nums font-semibold bg-muted/60 group-hover:bg-muted"
                    >
                      {fmt(rowTotals[ri][vi])}
                    </td>
                  ))}
              </tr>
            ))
          )}
        </tbody>
        <tfoot>
          <tr className="font-semibold">
            <td
              colSpan={Math.max(rowFields.length, 1)}
              style={
                rowFields.length > 0
                  ? {
                      left: 0,
                      width: totalRowColsWidth,
                      minWidth: totalRowColsWidth,
                      boxShadow: STICKY_BORDER_SHADOW,
                    }
                  : undefined
              }
              className="border px-3 py-2 bg-muted sticky z-20"
            >
              Total Geral
            </td>
            {hasColumns
              ? columnHeaders.map((_, ci) =>
                  valueLabels.map((_, vi) => (
                    <td
                      key={`ct-${ci}-${vi}`}
                      className="border px-3 py-2 text-right tabular-nums bg-muted"
                    >
                      {fmt(columnTotals[ci][vi])}
                    </td>
                  ))
                )
              : valueLabels.map((_, vi) => (
                  <td
                    key={`gt-${vi}`}
                    className="border px-3 py-2 text-right tabular-nums bg-muted"
                  >
                    {fmt(grandTotals[vi])}
                  </td>
                ))}
            {hasColumns &&
              valueLabels.map((_, vi) => (
                <td
                  key={`gt-${vi}`}
                  className="border px-3 py-2 text-right tabular-nums bg-muted"
                >
                  {fmt(grandTotals[vi])}
                </td>
              ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
