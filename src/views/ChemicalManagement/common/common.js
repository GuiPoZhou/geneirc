export function getNowTime() {
	let now = new Date();
	let year = now.getFullYear(); //得到年份
	let month = now.getMonth(); //得到月份
	let date = now.getDate(); //得到日期
	month = month + 1;
	month = month.toString().padStart(2, "0");
	date = date.toString().padStart(2, "0");
	let defaultDate = `${year}-${month}-${date}`;

	return defaultDate
}
