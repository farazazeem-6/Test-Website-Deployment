let headingName = document.getElementById('heading-name')
const firstName1 = localStorage.getItem('first-name');
console.log(firstName1);

headingName.innerText=firstName1
