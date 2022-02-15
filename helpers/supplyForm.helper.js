/* eslint-disable no-restricted-syntax */
import fs from 'fs';

import {
  WidthType,
  Table,
  TableRow,
  TableCell,
  Paragraph,
  Document,
  Packer,
  HeightRule,
  AlignmentType,
  TextRun,
  ImageRun,
} from 'docx';

function sortFunction(a, b) {
  if (a.itemOrder < b.itemOrder) {
    return -1;
  }
  if (a.itemOrder > b.itemOrder) {
    return 1;
  }
  if (a.itemOrder === b.itemOrder) {
    return 0;
  }
  return 0;
}

function splitArr(data) {
  const splitItems = [];
  const halfway = parseInt(data.length / 2, 10);
  if (data.length % 2 === 0) {
    for (let i = 0, j = halfway; i < j; i += 1) {
      splitItems.push([data[i], data[i + halfway]]);
    }
  } else {
    for (let i = 0, j = halfway; i <= j; i += 1) {
      if (i + halfway < data.length - 1) {
        // eslint-disable-next-line no-undef
        splitItems.push([data[i], dummyData[i + halfway + 1]]);
      } else {
        splitItems.push([data[i]]);
      }
    }
  }
  return splitItems;
}

const columnTitles = [
  ['Name:', 2, 27],
  ['School:', 1, 25],
  ['Shop Time:', 1, 10],
  ['LPPBID:', 1, 15],
];
const columnCells = columnTitles.map(
  (title) =>
    new TableCell({
      // Make all cells the same with over 100% of the available page width
      width: { size: title[2], type: WidthType.PERCENTAGE },
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: title[0],
              bold: true,
              size: 22,
              font: 'Calibri',
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
      ],
      columnSpan: title[1],
    })
);

columnCells.unshift(
  new TableCell({
    width: { size: 20, type: WidthType.PERCENTAGE },
    children: [
      new Paragraph({
        children: [
          new ImageRun({
            data: fs.readFileSync('./LPPencil.jpg'),
            transformation: {
              width: 100,
              height: 50,
            },
          }),
        ],
      }),
    ],
  })
);

const newTitles = [
  ['Item', 2],
  ['Limit', 1],
  ['Quantity', 1],
  ['Item', 2],
  ['Limit', 1],
  ['Quantity', 1],
];
const titleCells = newTitles.map(
  (title) =>
    new TableCell({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: title[0],
              alignment: AlignmentType.CENTER,
              bold: true,
              font: 'Calibri',
              size: 22,
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
      ],
      // width: { size: 100 / 8 * title[1], type: WidthType.PERCENTAGE }
    })
);

const rowsArr = [
  new TableRow({
    children: columnCells,
    width: { size: 100, type: WidthType.PERCENTAGE },
    height: { value: 900, rule: HeightRule.EXACT },
  }),
  new TableRow({
    children: titleCells,
    width: { size: 100, type: WidthType.PERCENTAGE },
    height: { value: 300, rule: HeightRule.EXACT },
  }),
];

function pushRowArr(splitItems) {
  for (const itemArr of splitItems) {
    const singleRow = [];
    for (const item of itemArr) {
      singleRow.push(
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: item.itemName,
                  bold: true,
                  font: 'Calibri',
                  size: 22,
                }),
              ],
            }),
          ],
          // width: { size: 100 / 8 * 2, type: WidthType.PERCENTAGE }
        })
      );
      singleRow.push(
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: item.maxLimit.toString(),
                  bold: true,
                  font: 'Calibri',
                  size: 22,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          // width: { size: 100 / 8 * 1, type: WidthType.PERCENTAGE }
        })
      );
      singleRow.push(
        new TableCell({
          children: [new Paragraph('      ')],
          // width: { size: 100 / 8 * 1, type: WidthType.PERCENTAGE }
        })
      );
    }
    rowsArr.push(
      new TableRow({
        children: singleRow,
        height: { value: 300, rule: HeightRule.EXACT },
        // width: { size: 100 / newTitles.length, type: WidthType.PERCENTAGE }
      })
    );
  }
}

function createFile() {
  const table = new Table({
    rows: rowsArr,
  });

  const doc = new Document({
    sections: [
      {
        children: [
          table,
          new Paragraph(' '),
          new Paragraph({
            children: [
              new TextRun({
                text: 'I understand that these items are for classroom use only and may not be sold, bartered, traded, or used for personal use, per IRS regulations. ',
                bold: false,
                font: 'Calibri',
                size: 22,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph(' '),
          new Paragraph(' '),
          new Paragraph(' '),
          new Paragraph({
            children: [
              new TextRun({
                text: '\nSignature: __________________________________________		Date: ________10/2/2021____',
                bold: false,
                font: 'Calibri',
                size: 22,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
        ],
        properties: {
          page: {
            margin: {
              right: 800,
              left: 800,
            },
          },
        },
      },
    ],
  });

  Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync('tableDoc.docx', buffer);
  });
}

export default function printForm(data) {
  data.sort(sortFunction);
  const splitItems = splitArr(data);
  pushRowArr(splitItems);
  createFile();
}
