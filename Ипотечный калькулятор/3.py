import requests

url = 'https://www.avito.ru/web/1/recyclemap-backend/getPoint?id=7462'
response = requests.get(url)
print(response.text)

fetch('https://www.avito.ru/web/1/recyclemap-backend/getPoint?id=7462')
  .then(response => response.json())
  .then(data => console.log(data));

