const convert = {
    FormatTimeToLocalFull: (date: Date) => {
        return date.toLocaleString("id-ID", {
            timeZone: "Asia/Jakarta",
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    },

    FormatTimetoLocalJustDate:  (date: Date) => {
        return date.toLocaleDateString("id-ID", {
            timeZone: "Asia/Jakarta",
            timeStyle: "full",
            dateStyle: "long"
        })
    } 
}

export default convert;