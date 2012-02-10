function makeGraph(x, y, showGrid) {
	//this is required for some odd reason when using a <g /> element in svgedit
	$('#g_title').remove();
	$('<input id="g_title" type="hidden" value=""/>')
		.appendTo('body');
	
	x = $.extend({
		i: 0,
		min: 0,
		max: 10,
		d: [],
		label: [],
		pixel: {
			i: 0,
			min: 50,
			max: 520,
			tick: [],
			halfTick: []
		}
	}, x);
	
	y = $.extend({
		i: 0,
		min: 0,
		max: 10,
		d: [],
		label: [],
		pixel: {
			i: 0,
			min: 10,
			max: 240,
			tick: [],
			halfTick: []
		}
	}, y);
	
	if (x.min >= x.max || y.min >= y.max || isNaN(y.min) || isNaN(y.max) || isNaN(x.min) || isNaN(x.max)) {
		$('.cwmDialog:last').hide();
		CastTabs.dialog({
			title: "Problem with your settings",
			content: 'It looks like there is a problem with your settings. Please ensure that min is smaller than max and that you have input numbers.',
			buttons: {
				Ok: function(me) {
					me.remove();
					$('.cwmDialog:last').show();
				}
			}
		});
		
		return $('<svg />');
	}
	
	x.template = {
		bg: 	'<line x1="{xPixelTick}" x2="{xPixelTick}" y1="' + y.pixel.min + '" y2="' + y.pixel.max + '"/>',
		bgZero: '<line x1="{xPixelTick}" x2="{xPixelTick}" y1="' + y.pixel.min + '" y2="' + y.pixel.max + '" style="stroke-width:2"/>',
		tick: 	'<line x1="{xPixelTick}" x2="{xPixelTick}" y1="{yPixelBaseTickStart}" y2="{yPixelBaseTickStop}"/>',
		halfTick:'<line x1="{xPixelHalfTick}" x2="{xPixelHalfTick}" y1="{yPixelBaseHalfTickStart}" y2="{yPixelBaseHalfTickStop}"/>',
		label: 	'<text x="{xPixelTick}" y="{yPixelBaseLabel}">{xVal}</text>'
	};
	
	y.template = {
		bg: 	'<line x1="' + x.pixel.min + '" x2="' + x.pixel.max + '" y1="{yPixelTick}" y2="{yPixelTick}"/>',
		bgZero: '<line x1="' + x.pixel.min + '" x2="' + x.pixel.max + '" y1="{yPixelTick}" y2="{yPixelTick}" style="stroke-width:2"/>',
		tick: 	'<line x1="{xPixelBaseTickStart}" x2="{xPixelBaseTickStop}" y1="{yPixelTick}" y2="{yPixelTick}"/>',
		halfTick:'<line x1="{xPixelBaseHalfTickStart}" x2="{xPixelBaseHalfTickStop}" y1="{yPixelHalfTick}" y2="{yPixelHalfTick}"/>',
		label: 	'<text x="{xPixelBaseLabel}" y="{yPixelText}" style="top: 10px; position: relative;">{yVal}</text>'
	};
	
	x.html = {
		bg: '',
		bgZero: '',
		tick: '',
		halfTick: '',
		label: ''
	};
	
	y.html = {
		bg: '',
		bgZero: '',
		tick: '',
		halfTick: '',
		label: ''
	};
	
	function dec(v) {
		if (parseInt(v) != v) {
			return v.toFixed(2) * 1;
		}
		
		return v;
	}
	
	function proc(template) {
		var xPixelBase = x.label.indexOf(0);
		var yPixelBase = y.label.indexOf(0);
		
		if (xPixelBase < 0) xPixelBase = 0;
		if (yPixelBase < 0) yPixelBase = y.pixel.tick.length - 1;
		 
		template = template
			.replace(/[{]xVal[}]/g, dec(x.label[x.i] || 0))
			.replace(/[{]yVal[}]/g, dec(y.label[y.i] || 0))
			.replace(/[{]xPixelTick[}]/g, x.pixel.tick[x.i] || 0)
			.replace(/[{]yPixelTick[}]/g, y.pixel.tick[y.i] || 0)
			.replace(/[{]yPixelText[}]/g, y.pixel.tick[y.i] + 3 || 0)
			.replace(/[{]xPixelHalfTick[}]/g, x.pixel.halfTick[x.i] || 0)
			.replace(/[{]yPixelHalfTick[}]/g, y.pixel.halfTick[y.i] || 0)
			.replace(/[{]xPixelBaseLabel[}]/g, (xPixelBase > -1 ? x.pixel.tick[xPixelBase] : 0) - 9)
			.replace(/[{]yPixelBaseLabel[}]/g, (yPixelBase > -1 ? y.pixel.tick[yPixelBase] : 0) + 15)
			.replace(/[{]xPixelBaseTickStart[}]/g, (xPixelBase > -1 ? x.pixel.tick[xPixelBase] : 0))
			.replace(/[{]xPixelBaseTickStop[}]/g, (xPixelBase > -1 ? x.pixel.tick[xPixelBase] : 0) - 5)
			.replace(/[{]yPixelBaseTickStart[}]/g, (yPixelBase > -1 ? y.pixel.tick[yPixelBase] : 0))
			.replace(/[{]yPixelBaseTickStop[}]/g, (yPixelBase > -1 ? y.pixel.tick[yPixelBase] : 0) + 5)
			.replace(/[{]yPixelBaseHalfTickStart[}]/g, (yPixelBase > -1 ? y.pixel.tick[yPixelBase] : 0))
			.replace(/[{]yPixelBaseHalfTickStop[}]/g, (yPixelBase > -1 ? y.pixel.tick[yPixelBase] : 0) + 2)
			.replace(/[{]yPixelBaseTick[}]/g, (yPixelBase > -1 ? y.pixel.tick[yPixelBase] : 0) + 15)
			.replace(/[{]xPixelBaseHalfTickStart[}]/g, (xPixelBase > -1 ? x.pixel.tick[xPixelBase] : 0))
			.replace(/[{]xPixelBaseHalfTickStop[}]/g, (xPixelBase > -1 ? x.pixel.tick[xPixelBase] : 0) - 2)
			.replace(/[{]yPixelBaseHalfTick[}]/g, (yPixelBase > -1 ? y.pixel.tick[yPixelBase] : 0) + 15);
		
		return template;
	}
	
	function processGridPlacement(o) {
		o.d = $.jqplot.LinearTickGenerator(o.min.toFixed(2), o.max, 1, 11);
		
		o.label.push(o.min);
		
		while(o.label[o.label.length - 1] < o.max) {
			var tick = o.label[o.label.length - 1] + o.d[4];
			o.label.push(tick);
		}
		
		if (o.label[o.label.length - 1] >= o.max) o.label.pop();
		
		o.label.push(o.max);
		
		var addedZero = false;
		$.each(o.label, function(i) {
			if (!addedZero) {
				if (o.label[i + 1] && o.label[i]) {
					if (o.label[i + 1] > 0 && o.label[i] < 0 && o.label[0] != 0) {
						o.label.splice(i + 1, 0, 0);
						addedZero = true;
					}
				}
			}
		});
		
		var labelTotal = o.max - o.min;
		var pixelTotal = o.pixel.max - o.pixel.min;
		var tick = pixelTotal / labelTotal;
		
		$.each(o.label, function(i) {	
			var pixelTick = tick * (o.label[i] - o.label[0]);
			o.pixel.tick.push(pixelTick + o.pixel.min);
		});
		
		$.each(o.pixel.tick, function(i) {
			var halfTick = (o.pixel.tick[i + 1] - o.pixel.tick[i]) / 2;
			
			o.pixel.halfTick.push(o.pixel.tick[i] + halfTick);
		});
		
		return o;
	}
	
	x = processGridPlacement(x);
	y = processGridPlacement(y);
	
	x.i = 0;
	y.i = y.label.length - 1;
	
	y.label = y.label.reverse();
	
	var go = true;
	while(go) {
		var xStop = true, yStop = true;
		
		if (x.label[x.i] <= x.max) {
			x.html.bg 		+= 	proc(x.template.bg);
			x.html.tick 	+= 	proc(x.template.tick);
			
			if (x.label[x.i] < x.max)
				x.html.halfTick	+= 	proc(x.template.halfTick);
			
			x.html.label 	+=	proc(x.template.label);
			
			if (x.label[x.i] == 0) x.html.bgZero += proc(x.template.bgZero);
			
			xStop = false;
		}
		
		if (y.label[y.i] >= y.min) {
			y.html.bg 		+= 	proc(y.template.bg);
			y.html.tick 	+= 	proc(y.template.tick);
			
			if (y.label[y.i] > y.min)
				y.html.halfTick += 	proc(y.template.halfTick);
			
			y.html.label 	+=	proc(y.template.label);
			
			if (y.label[y.i] == 0) y.html.bgZero += proc(y.template.bgZero);
			
			yStop = false;
		}
		
		x.i++;
		y.i--;
		
		if (xStop && yStop) go = false; 
	}
	
	if (showGrid) {
		y.html.bg = '<g class="yGrid" stroke="gray" stroke-dasharray="2,2">' + y.html.bg + '</g>';
		x.html.bg = '<g class="xGrid" stroke="gray" stroke-dasharray="2,2">' + x.html.bg + '</g>';
	} else {
		x.html.bg = '';
		y.html.bg = '';
	}
	
    return $('<svg>\
        <g class="cwmGraphAxis" id="' + svgCanvas.getNextId() + '" value="Graph" locked="true">\
			<rect x="' + x.pixel.min + '" y="' + y.pixel.min + '" width="' + (x.pixel.max - 50) + '" height="' + (y.pixel.max - 10) + '"/>\
            ' + y.html.bg + x.html.bg + '\
            <g class="xGrid" stroke="black">' + x.html.bgZero + '</g>\
			<g class="yGrid" stroke="black">' + y.html.bgZero + '</g>\
            <g class="yAxis" stroke="black" stroke-width="1">\
                ' + y.html.tick + '\
                ' + y.html.halfTick + '\
            </g>\
            <g class="yAxisLabel" text-anchor="end">\
                ' + y.html.label + '\
            </g>\
            <g class="xAxis" stroke="black" stroke-width="1">\
                ' + x.html.tick + '\
                ' + x.html.halfTick + '\
            </g>\
            <g class="xAxisLabel" text-anchor="middle">\
                ' + x.html.label + '\
            </g>\
            <text x="0" y="' + (y.pixel.max / 2) + '">Y Axis</text>\
            <text x="' + (x.pixel.max / 2) + '" y="' + (y.pixel.max + 30) + '">X Axis</text>\
        </g>\
    </svg>');
}

svgEditor.addExtension("cwm-graph-axis", function() {
	return {
		svgicons: serverImagePath + "cast/images/cast_icons.svg",
		callback: function() {
			$.resizeSvgIcons({
				"#cast_drawing_graph_axis .svg_icon": [70,30]
			});
		},
		buttons: [{
			id: "cast_drawing_graph_axis",
			type: "context",
			panel: "buttons_starters",
			title: "Graph Axis",
			events: {
				"mouseup": function() {
					CastTabs.dialog({
						title: "Setup your graph",
						content: $('<table style="width: 100%;border-collapse:collapse; border: none;">\
							<tr>\
								<td style="width: 80px; vertical-align: top;">Y max:<input id="ymax" type="text" value="10" style="width: 25px;"/></td>\
								<td></td>\
								<td colspan="3" rowspan="2" id="graphPreview"></td>\
							</tr>\
							<tr>\
								<td>Y min:<input id="ymin" type="text" value="0" style="width: 25px;"/></td>\
							</tr>\
							<tr>\
								<td></td>\
								<td></td>\
								<td style="text-align: center;"><input id="xmin" type="text" value="0" style="width: 25px;"/><br />X min:</td>\
								<td style="width:100px;"></td>\
								<td style="text-align: center;"><input id="xmax" type="text" value="10" style="width: 25px;"/><br />X max:</td>\
							</tr>\
						</table>'),
						inputs: [{
							value: 'true',
							label: 'include grid lines',
							type: 'checkbox',
							events: {
								mouseup: function() {
									var o = $(this);
									setTimeout(function() {
										if (o.is(':checked')) {
											$('.genGraph').show();
										} else {
											$('.genGraph').hide();
										}
									}, 1);
								}
							}
						}],
						buttons: {
							Cancel: function(me) {
								me.remove();
							},
							Ok: function(me, inputs) {
								var x = {
									min: me.find('#xmin').val() * 1,
									max: me.find('#xmax').val() * 1
								};
								var y = {
									min: me.find('#ymin').val() * 1,
									max: me.find('#ymax').val() * 1
								};
								
								var graph = makeGraph(x, y, inputs[0].obj.is(':checked'));
								
								// if shape is a path but we need to create a rect/ellipse, then remove the path
								var drawing = svgCanvas.getCurrentDrawing();
								var g = graph.children()[0];
								var current_layer = drawing.getCurrentLayer();
								current_layer.appendChild(g);
								
								svgEditor.canvas.setMode('select');
								svgCanvas.groupSelectedElements();
								
								me.remove();
							}
						},
						width: 350
					});
					
					$('.cwmDialog input:checkbox').addClass('gridLines');
					
					$('#xmin,#xmax,#ymin,#ymax,input.gridLines:first').change(function() {
						var graph = makeGraph({
							min: $('#xmin').val() * 1,
							max: $('#xmax').val() * 1
						}, {
							min: $('#ymin').val() * 1,
							max: $('#ymax').val() * 1
						}, $('input.gridLines:first').is(':checked'));
						
						var g = graph.find('g:first');
						if (g.length) {
							g.attr('transform', 'scale(0.45)');
						}
					
						var gP = $('#graphPreview')
							.html(graph);
						
						if (!g.length) {
							$('#xmin,#ymin').val(0);
							$('#xmax,#ymax').val(10);
							$(this).change();
						}
					})
					.keyup(function() {
						$(this).change();
					})
					.mouseup(function() {
						var me = $(this);
						setTimeout(function() {
							me.change();
						}, 1);
					})
					.change();
				}
			}
		}]
	}
});