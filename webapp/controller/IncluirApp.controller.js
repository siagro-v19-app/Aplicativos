sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
], function(Controller, History, MessageBox, JSONModel)  {
	"use strict";

	return Controller.extend("br.com.idxtecAplicativos.controller.IncluirApp", {
		onInit: function(){
			var oRouter = this.getOwnerComponent().getRouter();
			
			oRouter.getRoute("incluirapp").attachMatched(this._routerMatch, this);
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			
			this._operacao = null;
			this._sPath = null;
			
			var oJSONModel = new JSONModel();
			this.getOwnerComponent().setModel(oJSONModel,"model");
		},
		
		_routerMatch: function(){
			var oParam = this.getOwnerComponent().getModel("parametros").getData();
			var oJSONModel = this.getOwnerComponent().getModel("model");
			var oModel = this.getOwnerComponent().getModel();
			
			this._operacao = oParam.operacao;
			this._sPath = oParam.sPath;
			
			if (this._operacao === "incluir"){
				var oNovoApp = {
					"Id": 0,
					"AppId": "",
					"Codigo": "",
					"NomeMenu": "",
					"Path": "",
					"Descricao": "",
					"Modulo": 0
				};
				
				oJSONModel.setData(oNovoApp);
				
				this.getView().byId("modulo").setSelectedKey("");
				
			} else if (this._operacao === "editar"){
				oModel.read(oParam.sPath,{
					success: function(oData) {
						oJSONModel.setData(oData);
					},
					error: function(oError) {
						MessageBox.error(oError.responseText);
					}
				});
			}
		},
		
		onSalvar: function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			
			if (this._checarCampos(this.getView())) {
				MessageBox.information("Campo(s) obrigatorio(s) não preenchido(s)");
				return;
			}
			
			if (this._operacao === "incluir") {
				this._createApp();
				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					oRouter.navTo("aplicativos", {}, true);
				}
			} else if (this._operacao === "editar") {
				this._updateApp();
				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					oRouter.navTo("aplicativos", {}, true);
				}
			}
		},
		
		_createApp: function() {
			var oModel = this.getOwnerComponent().getModel();
			var oJSONModel = this.getOwnerComponent().getModel("model");
			
			var oDados = oJSONModel.getData();
			//Modulo = id, mas vem como string
			oDados.Modulo = parseInt(oDados.Modulo, 0);
			oDados.ModuloDetails = {
				__metadata: {
					uri: "/Modulos(" + oDados.Modulo + ")"
				}
			};
			
			oModel.create("/Aplicativos", oDados, {
				success: function() {
					MessageBox.success("Dados gravados.");
				},
				error: function(oError) {
					MessageBox.error(oError.responseText);
				}
			});
		},
		
		_updateApp: function() {
			var oModel = this.getOwnerComponent().getModel();
			var oJSONModel = this.getOwnerComponent().getModel("model");
			
			var oDados = oJSONModel.getData();
			oDados.Modulo = parseInt(oDados.Modulo, 0);
			oDados.ModuloDetails = {
				__metadata: {
					uri: "/Modulos(" + oDados.Modulo + ")"
				}
			};
			
			oModel.update(this._sPath, oDados, {
					success: function() {
					MessageBox.success("Dados gravados.");
				},
				error: function(oError) {
					MessageBox.error(oError.responseText);
				}
			});
		},
		
		_checarCampos: function(oView){
			if(oView.byId("appid").getValue() === "" || oView.byId("codigo").getValue() === ""
			|| oView.byId("nomemenu").getValue() === "" || oView.byId("url").getValue() === ""){
				return true;
			} else{
				return false; 
			}
		},
		
		onVoltar: function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
		
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				oRouter.navTo("aplicativos", {}, true);
			}
		}
	});
});