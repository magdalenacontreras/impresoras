timer=0;
function update(){
 $.getJSON('/info/',function (data) {
         $( "#printer-list" ).html("")
        $.each( data, function( key, val ) {
              items=[]
              items.push( "<div class='col-sm-4'><div class='card data-usage'><h4 class='h5'>" );
              items.push( val.modelo + "["+val.ip+"]" );
              items.push( "</h4>" );
              items.push("<div class='row d-flex align-items-center'><div class='col-sm-12'><h3>Cartuchos</h3></div></div>")
              for(i=0;i< val.total.length ;i++){
              items.push(
                  "<div class='row d-flex align-items-center'>" +
                  "<div class='col-sm-8'>" +
                  "<div class='progress'><div role='progressbar' style='width: "+( (val.niveles[i]/val.total[i] )*100 )+"%; background-color: "+val.colores[i]+"' aria-valuenow='"+( (val.niveles[i]/val.total[i] )*100 )+"' aria-valuemin='0' aria-valuemax='100' class='progress-bar progress-bar'></div></div>"+
                  "</div>" +
                  "<div class='col-sm-4'><strong class='text-primary'>"+( (val.niveles[i]/val.total[i] )*100 )+"</strong><small>"+val.nombre_cartuchos[i]+"</small><span>"+val.colores[i]+"</span></div>" +
                  "</div>");


              }
            items.push("<div class='row d-flex align-items-center'><div class='col-sm-12'><h3>Bandejas de Papel</h3></div></div>")
              for(i=0;i< val.bandejas.length ;i++){

                  capacidad=(val.capacidad_actual[i]/val.capacidad_maxima[i] )*100;
                  color="red";
                  if( capacidad > 55 ){
                      color="green";
                  } else{
                      if(capacidad>30){
                          color="orange"
                      }
                  }


              items.push(
                  "<div class='row d-flex align-items-center'>" +
                  "<div class='col-sm-8'>" +
                  "<div class='progress'><div role='progressbar' style='width: "+capacidad+"%; background-color: "+color+"' aria-valuenow='"+( (val.niveles[i]/val.total[i] )*100 )+"' aria-valuemin='0' aria-valuemax='100' class='progress-bar progress-bar'></div></div>"+
                  "</div>" +
                  "<div class='col-sm-4'><strong class='text-primary'>"+( capacidad )+"</strong><small>"+val.bandejas[i]+"</small><span></span></div>" +
                  "</div>");


              }


              items.push( "</div><hr/></div>" );

              $("#printer-list").append(items.join(""));
      })


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


    setInterval(update,5000)


});



