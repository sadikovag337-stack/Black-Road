import urllib.request, json

token = 'vcp_7vQqbWrNY1kOI2Ew3QsDJB9NdfK2F8ZJuT5UvRokbHjRFCC68v13Qt4A'
url = 'https://api.vercel.com/v9/projects/prj_4ws92iZh9wieeZ3O87CKT5Qji3hi/env/JNgfYvMWzgP6i7JV'
data = json.dumps({
    'value': '8430415915:AAHG7ttmu1HTGD1T1avvOqnJHaVTwnoVQe0',
    'target': ['production', 'preview']
}).encode('utf-8')
headers = {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
}
req = urllib.request.Request(url, data=data, headers=headers, method='PATCH')
try:
    print(urllib.request.urlopen(req).read().decode('utf-8'))
except Exception as e:
    print('ERROR:', repr(e))
