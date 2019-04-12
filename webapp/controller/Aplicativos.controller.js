sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(Controller, MessageBox, JSONModel, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("br.com.idxtecAplicativos.controller.Aplicativos", {
		onInit: function(){
			var oParamModel = new JSONModel();
			
			this.getOwnerComponent().setModel(oParamModel, "parametros");
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},
		
		filtraApp: function(oEvent){
			var sQuery = oEvent.getParameter("query");
			var oFilter = new Filter("Codigo", FilterOperator.Contains, sQuery);
			
			var aFilters = [
				oFilter
			];

			this.getView().byId("tableApp").getBinding("rows").filter(aFilters, "Application");
		},

		onRefresh: function(e){
			var oModel = this.getOwnerComponent().getModel();
			oModel.refresh(true);
			this.getView().byId("tableApp").clearSelection();
		},
		
		onIncluirApp: function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oTable = this.byId("tableApp"); 
			
			var oParModel = this.getOwnerComponent().getModel("parametros");
			oParModel.setData({operacao: "incluir"});
			
			oRouter.navTo("incluirapp");
			oTable.clearSelection();
		},
		
		onEditarApp: function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oTable = this.byId("tableApp");
			var nIndex = oTable.getSelectedIndex();
			
			if (nIndex === -1){
				MessageBox.warning("Selecione um aplicativo na tabela.");
				return;
			}
			
			var sPath = oTable.getContextByIndex(nIndex).sPath;
			var oParModel = this.getOwnerComponent().getModel("parametros");
			oParModel.setData({sPath: sPath, operacao: "editar"});
			
			oRouter.navTo("incluirapp");
			oTable.clearSelection();
		},
		
		onRemoverApp: function(e){
			var that = this;
			var oTable = this.byId("tableApp");
			var nIndex = oTable.getSelectedIndex();
			
			if (nIndex === -1){
				MessageBox.warning("Selecione um aplicativo na tabela.");
				return;
			}
			
			MessageBox.confirm("Deseja remover este aplicativo?", {
				onClose: function(sResposta){
					if(sResposta === "OK"){
						that._remover(oTable, nIndex);
						MessageBox.success("Aplicativo removido com sucesso!");
					}
				}
			});
		},
		
		_remover: function(oTable, nIndex){
			var oModel = this.getOwnerComponent().getModel();
			var oContext = oTable.getContextByIndex(nIndex);
			
			oModel.remove(oContext.sPath, {
				success: function(){
					oModel.refresh(true);
					oTable.clearSelection();
				},
				error: function(oError){
					MessageBox.error(oError.responseText);
				}
			});
		}
	});
});