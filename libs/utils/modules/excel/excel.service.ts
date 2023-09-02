import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as XLSX from 'xlsx';

@Injectable()
export class ExcelService {
  protected readonly sheetName = 'Sheet1';
  protected readonly fileName = 'Date';

  public generateExcelFile(data: any[]): Buffer {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();

    const borderStyle = {
      border: {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      },
    };

    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let row = range.s.r + 1; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
        ws[cellRef].s = borderStyle;
      }
    }

    XLSX.utils.book_append_sheet(wb, ws, this.sheetName);
    const excelBuffer = XLSX.write(wb, {
      type: 'buffer',
      bookType: 'xlsx',
    });
    return excelBuffer;
  }

  public sendFile(res: Response, buffer: Buffer, fileName?: string) {
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${
        fileName ?? this.fileName
      }.xlsx"`,
      'Content-Length': buffer.length.toString(),
    });
    res.send(buffer);
  }
}
