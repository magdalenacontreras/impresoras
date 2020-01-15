timer=0;
/*canvas {
		-moz-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
	};*/

var barChartData = {
			labels: [],
			datasets: [{
				label: 'Nivel Negro',
				backgroundColor: "rgba(0,0,0,0.5)",
				borderColor: "rgba(0,0,0,1)",
				borderWidth: 1,
				data: []
			}, {
				label: 'Nivel Cyan',
				backgroundColor:  "rgba(0,255,255,0.5)",
				borderColor: "rgba(0,255,255,1)",
				borderWidth: 1,
				data: []
			}, {
				label: 'Nivel Magenta',
				backgroundColor:  "rgba(255,0,255,0.5)",
				borderColor: "rgba(255,0,255,1)",
				borderWidth: 1,
				data: []
			}, {
				label: 'Nivel Yellow',
				backgroundColor: "rgba(255,255,0,0.5)",
				borderColor: "rgba(255,255,0,1)",
				borderWidth: 1,
				data: []

			}]
		};
var barChartDataBlack = {
			labels: [],
			datasets: [{
				label: 'Nivel Negro',
				backgroundColor: "rgba(0,0,0,0.5)",
				borderColor: "rgba(0,0,0,1)",
				borderWidth: 1,
				data: []
			}]
		};

var options = {
        series: [],
        chart: {
          height: 350,
          type: 'radialBar',
        },
        plotOptions: {
          radialBar: {
            offsetY: 0,
            startAngle: 0,
            endAngle: 90,
            hollow: {
              margin: 5,
              size: '30%',
              background: 'transparent',
              image: undefined,
            },
            dataLabels: {
              name: {
                fontSize: '16px',
              },
              value: {
                fontSize: '14px',
              },
              total: {
                show: true,
                label: 'Total',
                floating: false,
                }
            }
          }
        },
        labels: [],
        legend: {
          show: true,
          floating: false,
          fontSize: '12px',
          position: 'left',
          offsetX: 160,
          offsetY: 10,
          labels: {
            useSeriesColors: true,
          },
          markers: {
            size: 0
          },
          formatter: function(seriesName, opts) {
            return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex]
          },
          itemMargin: {
            horizontal: 3,
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
                show: true
            }
          }
        }]
      };

function update(){
    $.getJSON('/info/',function (data) {
        var labelsColors = [];
        var labelsBlack = [];
        var datablack = [];
        var datacyan = [];
        var datayellow = [];
        var datamagenta = [];
        var datablackcolor = [];
        itemsA=[]
        itemsB=[]
        j=0;
        k=0;
        $.each( data, function( key, val )
        {
            options.series = []
            options.labels = []
              if(val.total.length > 2){
                   barChartData.labels.push(val.nombre);
               }
              else{
                  barChartDataBlack.labels.push(val.nombre);
                  alert(barChartDataBlack.labels.toString())
              }
              for(i=0;i< val.total.length ;i++)
              {
                if( (val.total.length) > 2)
                {
                   switch(val.colores[i])
                   {
                        case 'black':
                            barChartData.datasets[0].data.push((val.niveles[i]/val.total[i] )*100 )
                        break;
                        case 'cyan':
                             barChartData.datasets[1].data.push((val.niveles[i]/val.total[i] )*100 )
                        break;
                        case 'yellow':
                             barChartData.datasets[3].data.push((val.niveles[i]/val.total[i] )*100 )
                        break;
                        case 'magenta':
                             barChartData.datasets[2].data.push((val.niveles[i]/val.total[i] )*100 )
                        break;

                    }
                }
                else if (val.colores[i]=='black'){
                    resultado=(val.niveles[i]/val.total[i] )*100
                    if(Number.isInteger(resultado))
                        barChartDataBlack.datasets[0].data.push(resultado)
                    else if (val.niveles[i+1]>0 && val.total[i+1]>0)
                        barChartDataBlack.datasets[0].data.push((val.niveles[i+1]/val.total[i+1] )*100 )
                    else
                        barChartDataBlack.datasets[0].data.push(0)

                    alert(barChartDataBlack.datasets[0].data.toString())
                }
                else if (val.colores[i]=='-1')
                {
                    resultado=(val.niveles[i]/val.total[i] )*100
                    if(Number.isInteger(resultado))
                        barChartDataBlack.datasets[0].data.push(resultado)
                }

             }

              for(i=0;i< val.bandejas.length ;i++)
             {
                 capacidad=(val.capacidad_actual[i]/val.capacidad_maxima[i] )*100;
                 //if(Number.isInteger(capacidad)) {
                        options.series.push(capacidad);
                        options.labels.push("Bandeja " + (i+1));
                       // }



             }
                //alert(options.series.toString())
                //alert(options.labels.toString())
                //items.push("<div class='col-sm-8'>");

                //items.push( "</div>");
                if( (val.total.length) > 2){
                    itemsA.push( "<div id='chartA"+ j +"' class='col-md-3' style='min-height: 200px; min-width: 500px; '></div>" );
                    $("#printer-list").append(itemsA.join(""));
                    options.plotOptions.radialBar.dataLabels.total.label= val.nombre;
                    var chart = new ApexCharts(document.querySelector("#chartA"+j), options);
                    j++;
                    itemsA.pop()
                }
                else{
                    itemsB.push( "<div id='chartB"+ k +"' class='col-md-3' style='min-height: 200px; min-width: 500px;'></div>" );
                    $("#printer-list-1").append(itemsB.join(""));
                    options.plotOptions.radialBar.dataLabels.total.label= val.nombre;
                    var chart = new ApexCharts(document.querySelector("#chartB"+k), options);
                    k++;
                    itemsB.pop()
                }

                chart.render();



                           //Finaliza una impresora


        })

     var ctx = document.getElementById('canvas').getContext('2d');
			window.myBar = new Chart(ctx, {
				type: 'bar',
				data: barChartData,
				options: {
					//responsive: true,
					tooltips: {
                        mode: 'index'
                    },
					legend: {
						position: 'top',
					},
					title: {
						display: true,
						text: 'Impresoras a Color'
					},
					scales:{
					 offset:true,
					    x: {
					        beginAtZero: true,

					    },
					    y:{
					       beginAtZero: true,
					       barEnd: 1000,
					    }
					},

					animation: {
					duration: 2000,

				}
				}
			});

	 var ctx1 = document.getElementById('foo').getContext('2d');
			window.myBar = new Chart(ctx1, {
				type: 'bar',
				data: barChartDataBlack,
				options: {
					legend: {
						position: 'top',
					},
					title: {
						display: true,
						text: 'Impresoras Blanco y Negro'
					},
					scales:{
					    offset:true,
					    x: {
					        beginAtZero: true,
					    },
					    y:{
					       beginAtZero: true,
					       end: 100,
					    }
					},
					animation: {
					duration: 2000,

				}
				}
			});
     })
 }


$(document).ready(function () {

    // ------------------------------------------------------- //
    // Custom Scrollbar
    // ------------------------------------------------------ //

    if ($(window).outerWidth() > 992) {
        $("nav.side-navbar").mCustomScrollbar({
            scrollInertia: 200
        });
    }
   update();
   //setInterval(update,5000)


});

