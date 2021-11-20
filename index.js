const { Client, logger } = require("camunda-external-task-client-js");
const { Variables } = require("camunda-external-task-client-js");
const axios = require('axios');

// - 'baseUrl': url para o Process Engine
// - 'logger': registrar automaticamente eventos importantes 
const config = { baseUrl: "http://localhost:8080/engine-rest", use: logger };

const baseURL = "https://www.receitaws.com.br/v1/cnpj/";

// cria uma instância do cliente com configuração personalizada 
const client = new Client(config);

// susbscribe no tópico: 'ConsultarCNPJ'
client.subscribe("ConsultarCNPJ", async function ({ task, taskService }) {
  // Ler variavel camunda
  var doc = task.variables.get("doc")
  console.log("** Doc: " + doc + "**");

  // Chamada Rest Consultar CNPJ
  (async () => {
    try {
      console.log("URL: " + baseURL + doc);
      const { data } = await axios.get(baseURL + doc);

      console.log(`Complete Sucess: ${data.nome}`);

      const processVariables = new Variables();
      processVariables.set("resultado", data.nome);

      // Completar tarefa sucesso
      await taskService.complete(task, processVariables);

    } catch (error) {
      console.log(`Complete Error: ${error.message}`);
      // Lancar erro handler
      await taskService.handleBpmnError(task, error.message);
    }
  })();

});