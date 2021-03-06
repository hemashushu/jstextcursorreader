const assert = require('assert/strict');

const { TextSelection } = require('jstextselection');
const { TextCursorReader } = require('../index');

describe('TextCursorReader Test', () => {
    it('Test readBack()/readForward()', () => {
        let text1 = '๐๐๐ผ๐๐คฆ๐ปโโ๏ธ'; // ้ฟๅบฆๅๅซๆฏ 2,4,2,7

        let selection1 = new TextSelection(6); // ไธญ้ดไฝ็ฝฎ
        let reader1 = new TextCursorReader(text1, selection1);

        let cb1 = reader1.readBack(1);
        assert.equal(cb1, '๐๐ผ');

        let cb2 = reader1.readBack(2);
        assert.equal(cb2, '๐๐๐ผ');

        let cb3 = reader1.readBack(3);
        assert.equal(cb3, '๐๐๐ผ');

        let cf1 = reader1.readForward(1);
        assert.equal(cf1, '๐');

        let cf2 = reader1.readForward(2);
        assert.equal(cf2, '๐๐คฆ๐ปโโ๏ธ');

        let cf3 = reader1.readForward(3);
        assert.equal(cf3, '๐๐คฆ๐ปโโ๏ธ');

        let selection2 = new TextSelection(0); // ๅผๅงไฝ็ฝฎ
        let reader2 = new TextCursorReader(text1, selection2);

        let cbh1 = reader2.readBack(1);
        assert.equal(cbh1, '');

        let cbh2 = reader2.readBack(2);
        assert.equal(cbh2, '');

        let cfh1 = reader2.readForward(1);
        assert.equal(cfh1, '๐');

        let cfh2 = reader2.readForward(2);
        assert.equal(cfh2, '๐๐๐ผ');

        let selection3 = new TextSelection(15); // ็ปๆไฝ็ฝฎ
        let reader3 = new TextCursorReader(text1, selection3);

        let cbt1 = reader3.readBack(1);
        assert.equal(cbt1, '๐คฆ๐ปโโ๏ธ');

        let cbt2 = reader3.readBack(2);
        assert.equal(cbt2, '๐๐คฆ๐ปโโ๏ธ');

        let cft1 = reader3.readForward(1);
        assert.equal(cft1, '');

        let cft2 = reader3.readForward(2);
        assert.equal(cft2, '');
    });

    it('Test readBack()/readForward() - with \\n trail', () => {

        let text1 = '012345678\n';
        // ' 0 1 2 3 4 5 6 7 8 \n'   <-- text
        //  0 1 2 3 4 5 6 7 8 9  10  <-- position

        let selection1 = new TextSelection(3, 6); // ไธญ้ดไฝ็ฝฎ '345'
        let reader1 = new TextCursorReader(text1, selection1);

        let cb1 = reader1.readBack(1);
        assert.equal(cb1, '2');

        let cb2 = reader1.readBack(2);
        assert.equal(cb2, '12');

        let cb3 = reader1.readBack(3);
        assert.equal(cb3, '012');

        let cb4 = reader1.readBack(4);
        assert.equal(cb4, '012');

        let cf1 = reader1.readForward(1);
        assert.equal(cf1, '6');

        let cf2 = reader1.readForward(2);
        assert.equal(cf2, '67');

        let cf3 = reader1.readForward(3);
        assert.equal(cf3, '678');

        let cf4 = reader1.readForward(4);
        assert.equal(cf4, '678');

        let selection2 = new TextSelection(0); // ๅผๅงไฝ็ฝฎ
        let reader2 = new TextCursorReader(text1, selection2);

        let cbh1 = reader2.readBack(1);
        assert.equal(cbh1, '');

        let cbh2 = reader2.readBack(2);
        assert.equal(cbh2, '');

        let cfh1 = reader2.readForward(1);
        assert.equal(cfh1, '0');

        let cfh2 = reader2.readForward(2);
        assert.equal(cfh2, '01');

        let selection3 = new TextSelection(10); // ็ปๆไฝ็ฝฎ
        let reader3 = new TextCursorReader(text1, selection3);

        let cbt1 = reader3.readBack(1);
        assert.equal(cbt1, '');

        let cbt2 = reader3.readBack(2);
        assert.equal(cbt2, '');

        let cft1 = reader3.readForward(1);
        assert.equal(cft1, '');

        let cft2 = reader3.readForward(2);
        assert.equal(cft2, '');
    });

    it('Test readBack()/readForward() - multiline', () => {

        let text1 = '0123\n5678\nabcd\nlmno';
        //                       11111 11111
        //           01234 56789 01234 56789 <-- index/offset

        let selection1 = new TextSelection(6, 11); // '678\na'
        let reader1 = new TextCursorReader(text1, selection1);

        let cb1 = reader1.readBack(1);
        assert.equal(cb1, '5');

        let cb2 = reader1.readBack(2);
        assert.equal(cb2, '5');

        let cf1 = reader1.readForward(1);
        assert.equal(cf1, 'b');

        let cf2 = reader1.readForward(2);
        assert.equal(cf2, 'bc');

        let cf3 = reader1.readForward(3);
        assert.equal(cf3, 'bcd');

        let cf4 = reader1.readForward(4);
        assert.equal(cf4, 'bcd');

        let selection2 = new TextSelection(6, 7); // ๅผๅงๅ็ปๆไฝ็ฝฎๅจๅไธ่ก
        let reader2 = new TextCursorReader(text1, selection2);

        let cbs1 = reader2.readBack(1);
        assert.equal(cbs1, '5');

        let cbs2 = reader2.readBack(2);
        assert.equal(cbs2, '5');

        let cfs1 = reader2.readForward(1);
        assert.equal(cfs1, '7');

        let cfs2 = reader2.readForward(2);
        assert.equal(cfs2, '78');

        let cfs3 = reader2.readForward(3);
        assert.equal(cfs3, '78');

        let selection3 = new TextSelection(5, 9); // ๅผๅงๅ็ปๆไฝ็ฝฎ้ไธญๆดไธ่ก
        let reader3 = new TextCursorReader(text1, selection3);

        let cbh1 = reader3.readBack(1);
        assert.equal(cbh1, '');

        let cbh2 = reader3.readBack(2);
        assert.equal(cbh2, '');

        let cfh1 = reader3.readForward(1);
        assert.equal(cfh1, '');

        let cfh2 = reader3.readForward(2);
        assert.equal(cfh2, '');
    });

    it('Test readBack()/readForward() - multiline and \\n trail', () => {

        let text1 = '0123\n5678\nabcd\nlmno\n';
        //                       11111 11111 2
        //           01234 56789 01234 56789 0 <-- index/offset

        let selection1 = new TextSelection(2, 17); // '23...lm'
        let reader1 = new TextCursorReader(text1, selection1);

        let cb1 = reader1.readBack(1);
        assert.equal(cb1, '1');

        let cb2 = reader1.readBack(2);
        assert.equal(cb2, '01');

        let cb3 = reader1.readBack(3);
        assert.equal(cb3, '01');

        let cf1 = reader1.readForward(1);
        assert.equal(cf1, 'n');

        let cf2 = reader1.readForward(2);
        assert.equal(cf2, 'no');

        let cf3 = reader1.readForward(3);
        assert.equal(cf3, 'no');
    });

    it('Test moveBack()/moveForward()', () => {
        let text1 = '๐๐๐ผ๐๐คฆ๐ปโโ๏ธ'; // ้ฟๅบฆๅๅซๆฏ 2,4,2,7

        let selection1 = new TextSelection(6); // ไธญ้ดไฝ็ฝฎ
        let reader1 = new TextCursorReader(text1, selection1);

        let cb1 = reader1.moveBack(1);
        assert.equal(cb1.start, 2);

        let cb2 = reader1.moveBack(2);
        assert.equal(cb2.start, 0);

        let cb3 = reader1.moveBack(3);
        assert.equal(cb3.start, 0);

        let cf1 = reader1.moveForward(1);
        assert.equal(cf1.start, 8);

        let cf2 = reader1.moveForward(2);
        assert.equal(cf2.start, 15);

        let cf3 = reader1.moveForward(3);
        assert.equal(cf3.start, 15);

        let selection2 = new TextSelection(0); // ๅผๅงไฝ็ฝฎ
        let reader2 = new TextCursorReader(text1, selection2);

        let cbh1 = reader2.moveBack(1);
        assert.equal(cbh1.start, 0);

        let cbh2 = reader2.moveBack(2);
        assert.equal(cbh2.start, 0);

        let cfh1 = reader2.moveForward(1);
        assert.equal(cfh1.start, 2);

        let cfh2 = reader2.moveForward(2);
        assert.equal(cfh2.start, 6);

        let selection3 = new TextSelection(15); // ็ปๆไฝ็ฝฎ
        let reader3 = new TextCursorReader(text1, selection3);

        let cbt1 = reader3.moveBack(1);
        assert.equal(cbt1.start, 8);

        let cbt2 = reader3.moveBack(2);
        assert.equal(cbt2.start, 6);

        let cft1 = reader3.moveForward(1);
        assert.equal(cft1.start, 15);

        let cft2 = reader3.moveForward(2);
        assert.equal(cft2.start, 15);
    });

    it('Test moveBack()/moveForward() - multiline', () => {

        let text1 = '0123\n5678\nabcd\nlmno';
        //                       11111 1111
        //           01234 56789 01234 5678 <-- index/offset

        let selection1 = new TextSelection(7); // ไธญ้ด่ก
        let reader1 = new TextCursorReader(text1, selection1);

        let cb1 = reader1.moveBack(1);
        assert.equal(cb1.start, 6);

        let cb2 = reader1.moveBack(2);
        assert.equal(cb2.start, 5);

        let cb3 = reader1.moveBack(3);
        assert.equal(cb3.start, 5);

        let cf1 = reader1.moveForward(1);
        assert.equal(cf1.start, 8);

        let cf2 = reader1.moveForward(2);
        assert.equal(cf2.start, 9);

        let cf3 = reader1.moveForward(3);
        assert.equal(cf3.start, 9);

        let selection2 = new TextSelection(2); // ็ฌฌไธ่ก
        let reader2 = new TextCursorReader(text1, selection2);

        let cbs1 = reader2.moveBack(1);
        assert.equal(cbs1.start, 1);

        let cbs2 = reader2.moveBack(2);
        assert.equal(cbs2.start, 0);

        let cbs3 = reader2.moveBack(3);
        assert.equal(cbs3.start, 0);

        let cfs1 = reader2.moveForward(1);
        assert.equal(cfs1.start, 3);

        let cfs2 = reader2.moveForward(2);
        assert.equal(cfs2.start, 4);

        let cfs3 = reader2.moveForward(3);
        assert.equal(cfs3.start, 4);

        let selection3 = new TextSelection(16); // ๆๅไธ่ก
        let reader3 = new TextCursorReader(text1, selection3);

        let cbh1 = reader3.moveBack(1);
        assert.equal(cbh1.start, 15);

        let cbh2 = reader3.moveBack(2);
        assert.equal(cbh2.start, 15);

        let cfh1 = reader3.moveForward(1);
        assert.equal(cfh1.start, 17);

        let cfh2 = reader3.moveForward(2);
        assert.equal(cfh2.start, 18);

        let cfh3 = reader3.moveForward(3);
        assert.equal(cfh3.start, 19);

        let cfh4 = reader3.moveForward(4);
        assert.equal(cfh4.start, 19);
    });

    it('Test expandBack()/expandForward()', () => {
        let text1 = '๐๐๐ผ๐๐คฆ๐ปโโ๏ธ'; // ้ฟๅบฆๅๅซๆฏ 2,4,2,7

        let selection1 = new TextSelection(6); // ไธญ้ดไฝ็ฝฎ
        let reader1 = new TextCursorReader(text1, selection1);

        let cb1 = reader1.expandBack(1);
        assert.equal(cb1.start, 2);
        assert.equal(cb1.end, 6);

        let cb2 = reader1.expandBack(2);
        assert.equal(cb2.start, 0);
        assert.equal(cb2.end, 6);

        let cb3 = reader1.expandBack(3);
        assert.equal(cb3.start, 0);
        assert.equal(cb2.end, 6);

        let cf1 = reader1.expandForward(1);
        assert.equal(cf1.start, 6);
        assert.equal(cf1.end, 8);

        let cf2 = reader1.expandForward(2);
        assert.equal(cf1.start, 6);
        assert.equal(cf2.end, 15);

        let cf3 = reader1.expandForward(3);
        assert.equal(cf1.start, 6);
        assert.equal(cf3.end, 15);

        let selection2 = new TextSelection(0); // ๅผๅงไฝ็ฝฎ
        let reader2 = new TextCursorReader(text1, selection2);

        let cbh1 = reader2.expandBack(1);
        assert.equal(cbh1.start, 0);
        assert.equal(cbh1.end, 0);

        let cbh2 = reader2.expandBack(2);
        assert.equal(cbh2.start, 0);
        assert.equal(cbh2.end, 0);

        let cfh1 = reader2.expandForward(1);
        assert.equal(cfh1.start, 0);
        assert.equal(cfh1.end, 2);

        let cfh2 = reader2.expandForward(2);
        assert.equal(cfh2.start, 0);
        assert.equal(cfh2.end, 6);

        let selection3 = new TextSelection(15); // ็ปๆไฝ็ฝฎ
        let reader3 = new TextCursorReader(text1, selection3);

        let cbt1 = reader3.expandBack(1);
        assert.equal(cbt1.start, 8);
        assert.equal(cbt1.end, 15);

        let cbt2 = reader3.expandBack(2);
        assert.equal(cbt2.start, 6);
        assert.equal(cbt2.end, 15);

        let cft1 = reader3.expandForward(1);
        assert.equal(cft1.start, 15);
        assert.equal(cft1.end, 15);

        let cft2 = reader3.expandForward(2);
        assert.equal(cft2.start, 15);
        assert.equal(cft2.end, 15);
    });

    it('Test expandBack()/expandForward() - multiline', () => {

        let text1 = '0123\n5678\nabcd\nlmno';
        //                       11111 1111
        //           01234 56789 01234 5678 <-- index/offset

        let selection1 = new TextSelection(6, 11); // '678\na'
        let reader1 = new TextCursorReader(text1, selection1);

        let cb1 = reader1.expandBack(1);
        assert.equal(cb1.start, 5);
        assert.equal(cb1.end, 11);

        let cb2 = reader1.expandBack(2);
        assert.equal(cb2.start, 5);
        assert.equal(cb2.end, 11);

        let cf1 = reader1.expandForward(1);
        assert.equal(cf1.start, 6);
        assert.equal(cf1.end, 12);

        let cf2 = reader1.expandForward(2);
        assert.equal(cf2.start, 6);
        assert.equal(cf2.end, 13);

        let cf3 = reader1.expandForward(3);
        assert.equal(cf3.start, 6);
        assert.equal(cf3.end, 14);

        let cf4 = reader1.expandForward(4);
        assert.equal(cf4.start, 6);
        assert.equal(cf4.end, 14);

        let selection2 = new TextSelection(6, 7); // ๅผๅงๅ็ปๆไฝ็ฝฎๅจๅไธ่ก
        let reader2 = new TextCursorReader(text1, selection2);

        let cbs1 = reader2.expandBack(1);
        assert.equal(cbs1.start, 5);
        assert.equal(cbs1.end, 7);

        let cbs2 = reader2.expandBack(2);
        assert.equal(cbs2.start, 5);
        assert.equal(cbs2.end, 7);

        let cfs1 = reader2.expandForward(1);
        assert.equal(cfs1.start, 6);
        assert.equal(cfs1.end, 8);

        let cfs2 = reader2.expandForward(2);
        assert.equal(cfs2.start, 6);
        assert.equal(cfs2.end, 9);

        let cfs3 = reader2.expandForward(3);
        assert.equal(cfs3.start, 6);
        assert.equal(cfs3.end, 9);

        let selection3 = new TextSelection(5, 9); // ๅผๅงๅ็ปๆไฝ็ฝฎ้ไธญๆดไธ่ก
        let reader3 = new TextCursorReader(text1, selection3);

        let cbh1 = reader3.expandBack(1);
        assert.equal(cbh1.start, 5);
        assert.equal(cbh1.end, 9);

        let cbh2 = reader3.expandBack(2);
        assert.equal(cbh2.start, 5);
        assert.equal(cbh2.end, 9);

        let cfh1 = reader3.expandForward(1);
        assert.equal(cfh1.start, 5);
        assert.equal(cfh1.end, 9);

        let cfh2 = reader3.expandForward(2);
        assert.equal(cfh2.start, 5);
        assert.equal(cfh2.end, 9);
    });
});