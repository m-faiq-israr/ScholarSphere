
const convertToCSV = (data) => {
    if (!data || data.length === 0) return "";
    const header = Object.keys(data[0]).join(",");
    const rows = data.map((item) =>
      Object.values(item)
        .map((value) =>
          typeof value === "string"
            ? `"${value.replace(/"/g, '""')}"`
            : `"${JSON.stringify(value)}"`
        )
        .join(",")
    );
    return [header, ...rows].join("\n");
  };
  
const downloadCSV = (csvContent, filename = "export.csv") => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  export {convertToCSV, downloadCSV}