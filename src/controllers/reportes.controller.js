const ExcelJS = require('exceljs');
const Reporte = require('../models/reporte.model');
const { leerRango } = require('../utils/fechas');

function leerFiltros(query) {
  const rango = leerRango(query, 30);
  let error = rango.error;
  if (!error && (!rango.desde || !rango.hasta)) error = 'Indica las dos fechas del reporte.';
  return { desde: rango.desde, hasta: rango.hasta, error };
}

async function ver(req, res, next) {
  try {
    const filtros = leerFiltros(req.query);
    let datos = null;

    if (!filtros.error) {
      const resultado = await Reporte.laboresRealizadas({ desde: filtros.desde, hasta: filtros.hasta });
      datos = { ...resultado, resumen: Reporte.resumir(resultado.filas) };
    }

    res.render('pages/admin/reportes/index', {
      filtros: { desde: filtros.desde, hasta: filtros.hasta },
      error: filtros.error,
      datos,
      limite: Reporte.LIMITE
    });
  } catch (error) {
    next(error);
  }
}

async function exportar(req, res, next) {
  try {
    const filtros = leerFiltros(req.query);
    if (filtros.error) return res.redirigir('/admin/reportes', 'error', filtros.error);

    const { filas, truncado } = await Reporte.laboresRealizadas({ desde: filtros.desde, hasta: filtros.hasta });
    const resumen = Reporte.resumir(filas);

    const libro = new ExcelJS.Workbook();
    libro.creator = 'DOVI S.A.S.';
    libro.created = new Date();

    const hoja = libro.addWorksheet('Labores realizadas');
    hoja.columns = [
      { header: 'Fecha', key: 'fecha', width: 12 },
      { header: 'Hora', key: 'hora', width: 8 },
      { header: 'Cliente', key: 'cliente', width: 28 },
      { header: 'Predio', key: 'predio', width: 28 },
      { header: 'Hectáreas', key: 'hectareas', width: 11 },
      { header: 'Labor', key: 'servicio', width: 28 },
      { header: 'Cuadrilla', key: 'cuadrilla', width: 36 },
      { header: 'Observaciones', key: 'observaciones', width: 44 }
    ];
    hoja.addRows(filas.map((f) => ({ ...f, hectareas: Number(f.hectareas) })));
    hoja.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    hoja.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF224A38' } };
    hoja.views = [{ state: 'frozen', ySplit: 1 }];
    hoja.autoFilter = { from: 'A1', to: 'H1' };

    const hojaResumen = libro.addWorksheet('Resumen');
    hojaResumen.columns = [
      { header: 'Labor', key: 'servicio', width: 34 },
      { header: 'Cantidad', key: 'cantidad', width: 12 }
    ];
    hojaResumen.addRows(resumen.porServicio);
    hojaResumen.addRow({ servicio: 'TOTAL', cantidad: resumen.total }).font = { bold: true };
    hojaResumen.addRow({});
    hojaResumen.addRow({ servicio: `Periodo: ${filtros.desde} a ${filtros.hasta}` });
    if (truncado) hojaResumen.addRow({ servicio: `Solo se incluyeron las primeras ${Reporte.LIMITE} labores.` });
    hojaResumen.getRow(1).font = { bold: true };

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="reporte-labores-${filtros.desde}_${filtros.hasta}.xlsx"`,
      'Cache-Control': 'no-store'
    });
    await libro.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
}

module.exports = { ver, exportar };
