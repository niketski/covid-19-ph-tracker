export default class Helper {
       
    formatNumber(string) {
        return string.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}