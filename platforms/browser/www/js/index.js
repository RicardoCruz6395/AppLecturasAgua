$(document).bind("mobileinit", function() {
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;
    $.mobile.pageLoadErrorMessage = "Ha ocurrido un error al cargar la vista";
    $.mobile.loadingMessage = "Espere un momento...";
    $.mobile.loadingMessageTextVisible = true;
    $.mobile.pushStateEnabled = true;
});

var application = {

	db : window.openDatabase('LecturasAppDB.db', '1.0', 'LecturasAppDB', 200000),

	nombreUsuario : document.getElementById('nombreUsuario'),

	checarConexion : function(){
        var networkState = navigator.connection.type;
		if( networkState != Connection.NONE && networkState != Connection.UNKNOWN ){
            return true;
        }else{
            navigator.notification.beep(1);
            application.vibrar();
            window.plugins.toast.hide();
            window.plugins.toast.showLongCenter('¡No hay conexión a Internet!', function(){}, function(e){})
            //navigator.notification.alert('¡No hay conexión a Internet!', function(){}, 'Aceptar');
            return false;
        }
    },

	verificarSesion : function( nombreUsuario ){
    	application.db.transaction(function(tx){
    		tx.executeSql('SELECT * FROM usuario WHERE rowid = ?;',[1],function(tx,result){
    			if( result.rows.length == 1 ){
    				nombreUsuario.innerHTML = result.rows.item(0).nombre; 
    			}else{
    				location.href = 'login.html'
    			}
    		});
    	}, application.errorSQL);
    },

    actualizarUltimaSincronizacion : function( field ){
        application.db.transaction(function(tx){
            timestamp = application.fechaActual()
            tx.executeSql('UPDATE bitacora SET ' + field + ' = ?;',[timestamp],function(tx,result){
                application.ultimaSincronizacion( field, document.getElementById( field ) );
            });
        });
    },

    ultimaSincronizacion : function( field, span ){
        application.db.transaction(function(tx){
            tx.executeSql('SELECT ' + field + ' last FROM bitacora WHERE rowid = ?;',[1],function(tx,result){
                ultima = '<b>Última vez: </b>'
                last = result.rows.item(0).last
                if( last != '' ){
                    ultima += application.formatoFecha( last ) + ' ' + application.formatoHora( last ) + ' Hrs'
                }else{
                    ultima += 'Nunca'
                }
                span.innerHTML = ultima
            })
        }, application.errorSQL);
    },

    asignarMedidor : function( medidor ){
    	application.medidorAsignado = medidor
    	//alert('quedo asignado ' + application.medidorAsignado )
    },

    fechaActual : function(){
        var d = new Date();
        return Math.floor(d.getTime()/1000);
    },

    formatoFecha : function( timestamp ){
        var fecha = new Date( timestamp*1000 );
        
        var dd = fecha.getDate();
        var mm = fecha.getMonth()+1;
        var yyyy = fecha.getFullYear();
    
        if(dd<10){ dd='0'+dd; } 
        if(mm<10){ mm='0'+mm; }
        return dd + '-' + mm + '-' + yyyy;                 
    },

    formatoHora : function( timestamp ){
        var fecha = new Date( timestamp*1000 );
 
    	var H = fecha.getHours();
        var i = fecha.getMinutes();
        var s = fecha.getSeconds();

        if(H<10){ H='0'+H; }
        if(i<10){ i='0'+i; }
        if(s<10){ s='0'+s; }
        return H + ':' + i + ':' + s;
    },

	exito : function(){
		
	},

	errorSQL : function(e){
		alert('Sucedió un error. Código ' + e.code + ': '+ e.message);
	},

	vibrar : function(){
        navigator.vibrate(700);
	},

	logout : function(){
    	application.db.transaction(function(tx){
    		tx.executeSql('DELETE FROM usuario;',[],application.verificarSesion);
    	}, application.errorSQL);
    },

	exit : function(){
		navigator.app.exitApp();
	}

};