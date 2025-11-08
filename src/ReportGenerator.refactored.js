class Generator {
  constructor(user, items) {
    this.user = user;
    this.items = items;
  }

  generateReport() {
    let report = this.generateHeader();
    const { body, total } = this.generateBody();
    report += body;
    report += this.generateFooter(total);

    return report.trim();
  }

  generateHeader() {}

  generateBody() {
    let body = "";
    let total = 0;

    for (const item of this.items) {
      if (
        this.user.role !== "ADMIN" &&
        (this.user.role !== "USER" || item.value > 500)
      )
        continue;

      const formattedItem = this.formatItem(item);
      body += formattedItem;
      total += item.value;
    }

    return { body, total };
  }

  generateFooter() {}

  formatItem() {}
}

class CsvGenerator extends Generator {
  generateHeader() {
    return "ID,NOME,VALOR,USUARIO\n";
  }

  generateFooter(total) {
    return `\nTotal,,\n${total},,\n`;
  }

  formatItem(item) {
    return `${item.id},${item.name},${item.value},${this.user.name}\n`;
  }
}

class HtmlGenerator extends Generator {
  generateHeader() {
    return `<html><body>\n<h1>Relatório</h1>\n<h2>Usuário: ${this.user.name}</h2>\n<table>\n<tr><th>ID</th><th>Nome</th><th>Valor</th></tr>\n`;
  }

  generateFooter(total) {
    return `</table>\n<h3>Total: ${total}</h3>\n</body></html>\n`;
  }

  formatItem(item) {
    const style =
      this.user.role === "ADMIN" && item.value > 1000
        ? 'style="font-weight:bold;"'
        : "";
    return `<tr ${style}><td>${item.id}</td><td>${item.name}</td><td>${item.value}</td></tr>\n`;
  }
}

export class ReportGenerator {
  constructor(database) {
    this.db = database;
  }

  /**
   * Gera um relatório de itens baseado no tipo e no usuário.
   * - Admins veem tudo.
   * - Users comuns só veem itens com valor <= 500.
   */
  generateReport(reportType, user, items) {
    const reportClass = reportType === "CSV" ? CsvGenerator : HtmlGenerator;

    return new reportClass(user, items).generateReport();
  }
}
