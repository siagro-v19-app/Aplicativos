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
			var oViewModel = this.getOwnerComponent().getModel("view"); 
			
			this._operacao = oParam.operacao;
			this._sPath = oParam.sPath;
			
			if (this._operacao === "incluir"){
				
				oViewModel.setData({
					titulo: "Inserir Novo App"
				});
				
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
				
				oViewModel.setData({
					titulo: "Editar App"
				});
				
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
			if (this._checarCampos(this.getView()) === true) {
				MessageBox.information("Preencha todos os campos obrigatórios!");
				return;
			}
			
			if (this._operacao === "incluir") {
				this._createApp();
			} else if (this._operacao === "editar") {
				this._updateApp();
			}
		},
		
		_goBack: function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				oRouter.navTo("aplicativos", {}, true);
			}
		},
		
		_getDados: function() {
			var oJSONModel = this.getOwnerComponent().getModel("model");
			var oDados = oJSONModel.getData();
			
			oDados.Modulo = parseInt(oDados.Modulo, 0);
			
			oDados.ModuloDetails = {
				__metadata: {
					uri: "/Modulos(" + oDados.Modulo + ")"
				}
			};
			
			return oDados;
		},
		
		_createApp: function() {
			var that = this; 
			var oModel = this.getOwnerComponent().getModel();

			oModel.create("/Aplicativos", this._getDados(), {
				success: function() {
					MessageBox.success("Aplicativo inserido com sucesso!",{
						onClose: function(){
							that._goBack();
						}
					});
				},
				error: function(oError) {
					MessageBox.error(oError.responseText);
				}
			});
		},
		
		_updateApp: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel();

			oModel.update(this._sPath, this._getDados(), {
					success: function() {
					MessageBox.success("Aplicativo alterado com sucesso!", {
						onClose: function(){
							that._goBack();
						}
					});
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
			this._goBack();
		}
	});
});