const { IllegalArgumentException } = require('jsexception');
const { StringUtils } = require('jsstringutils');
const { TextSelection } = require('jstextselection');

/**
 * 用于读取文本光标前后字符的模块
 *
 */
class TextCursorReader {
    /**
     *
     * @param {*} textContent 文本内容，换行符只允许 '\n'
     * @param {*} textSelection 光标位置
     */
    constructor(textContent, textSelection) {
        this.textContent = textContent;
        this.textSelection = textSelection;

        // 光标开始位置所在行的行首字符索引(index include)，或者文本的开始
        // 位置索引
        let startOffsetOfStartLine = textSelection.start;

        // 光标结束位置所在行的行尾（即换行符 '\n'）的字符索引(index exclude)，
        // 或者文本的结束位置的索引（即textContent.length，一个假象的结束位置）
        let endOffsetOfEndLine = textSelection.end;

        if (startOffsetOfStartLine > 0) {
            let foundStartOffset = false;

            for (; startOffsetOfStartLine > 0; startOffsetOfStartLine--) {
                if (textContent[startOffsetOfStartLine - 1] === '\n') {
                    foundStartOffset = true;
                    break;
                }
            }

            if (!foundStartOffset) {
                startOffsetOfStartLine = 0;
            }

        } else {
            startOffsetOfStartLine = 0;
        }

        if (endOffsetOfEndLine < textContent.length) {
            let foundEndOffset = false;

            for (; endOffsetOfEndLine < textContent.length; endOffsetOfEndLine++) {
                if (textContent[endOffsetOfEndLine] === '\n') {
                    foundEndOffset = true;
                    break;
                }
            }

            if (!foundEndOffset) {
                endOffsetOfEndLine = textContent.length;
            }

        } else {
            endOffsetOfEndLine = textContent.length;
        }


        this.startOffsetOfStartLine = startOffsetOfStartLine;
        this.endOffsetOfEndLine = endOffsetOfEndLine;
    }

    /**
     * 向后读取字符
     * 只能向后读到行首，或者读到文本开始位置即停止。
     *
     * @param {*} charCount
     * @returns
     */
    readBack(charCount) {
        let startOffset = this._getBackOffset(this.textSelection.start, charCount);
        return this.textContent.substring(startOffset, this.textSelection.start);
    }

    /**
     * 向后移动光标
     *
     * 只有折叠了的光标才能被移动
     *
     * @param {*} charCount
     * @returns 返回 TextSelection.
     */
    moveBack(charCount) {
        if (!TextSelection.isCollapsed(this.textSelection)) {
            throw new IllegalArgumentException('Only collapsed cursors can be moved.');
        }

        let startOffset = this._getBackOffset(this.textSelection.start, charCount);
        return new TextSelection(startOffset);
    }

    /**
     * 向后扩展光标
     *
     * 即保持当前的 TextSelection.end 不变，减小 TextSelection.start。
     * @param {*} charCount
     * @returns
     */
    expandBack(charCount) {
        let startOffset = this._getBackOffset(this.textSelection.start, charCount);
        return new TextSelection(startOffset, this.textSelection.end);
    }

    /**
     * 向前读取字符
     *
     * - 只能向前读到行尾（不包括换行符 \n），或者读到文本结束位置即停止。
     * @param {*} charCount
     * @returns
     */
    readForward(charCount) {
        let endOffset = this._getForwardOffset(this.textSelection.end, charCount);
        return this.textContent.substring(this.textSelection.end, endOffset);
    }

    /**
     * 向前移动光标
     *
     * - 只有折叠了的光标才能被移动
     * @param {*} charCount
     * @returns 返回 TextSelection.
     */
    moveForward(charCount) {
        if (!TextSelection.isCollapsed(this.textSelection)) {
            throw new IllegalArgumentException('Only collapsed cursors can be moved.');
        }

        let endOffset = this._getForwardOffset(this.textSelection.end, charCount);
        return new TextSelection(endOffset);
    }

    /**
     * 向前扩展光标
     *
     * 即保持当前的 TextSelection.start 不变，增加 TextSelection.end。
     * @param {*} charCount
     * @returns
     */
    expandForward(charCount) {
        let endOffset = this._getForwardOffset(this.textSelection.end, charCount);
        return new TextSelection(this.textSelection.start, endOffset);
    }

    /**
     * 计算指定（Unicode）字符数量之前的字符偏移值。
     * @param {*} offset
     * @param {*} charCount
     * @returns
     */
    _getBackOffset(offset, charCount) {
        for (let idx = 0; idx < charCount; idx++) {
            if (offset <= this.startOffsetOfStartLine) {
                break;
            }

            offset = StringUtils.getPreviousUnicodeOffset(this.textContent, offset);
        }

        if (offset < this.startOffsetOfStartLine) {
            offset = this.startOffsetOfStartLine;
        }

        return offset;
    }

    /**
     * 计算指定（Unicode）字符数量之后的字符偏移值。
     *
     * @param {*} offset
     * @param {*} charCount
     * @returns
     */
    _getForwardOffset(offset, charCount) {
        for (let idx = 0; idx < charCount; idx++) {
            if (offset >= this.endOffsetOfEndLine) {
                break;
            }

            offset = StringUtils.getNextUnicodeOffset(this.textContent, offset);
        }

        if (offset > this.endOffsetOfEndLine) {
            offset = this.endOffsetOfEndLine;
        }

        return offset;
    }
}

module.exports = TextCursorReader;