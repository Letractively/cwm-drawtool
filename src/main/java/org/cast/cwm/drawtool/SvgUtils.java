/**
 * Copyright 2011-2014 CAST, Inc.
 *
 * This file is part of the CAST extension of SVG Edit;
 * see http://code.google.com/p/cwm-drawtool for more information.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 * and associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH
 * THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
package org.cast.cwm.drawtool;

public class SvgUtils {

	public static String blankSvgImage(int width, int height) {
		return "<svg width=\"" + width 
				+ "\" height=\"" + height
				+ "\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">"
				+ "<g display=\"inline\"><title>Layer 1</title></g>"
				+ "</svg>";
	}
	
	public static String blankSvgImage() {
		return blankSvgImage(SvgEditor.CANVAS_WIDTH, SvgEditor.CANVAS_HEIGHT);
	}
	
}
