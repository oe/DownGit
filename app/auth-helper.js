// scope could specified to repo to download private repo
//  or only public repo are available
function getGithubAuthUrl(scope) {
  const authUrl = 'https://github.com/login/oauth/authorize'
  const params = new URLSearchParams()
  const query = {
    client_id: 'b377427312560921a071',
    redirect_uri: 'https://downgit.evecalm.com/auth.html',
    scope: scope,
    state: getRandomState()
  };
  Object.keys(query).forEach(key => {
    params.append(key, query[key])
  })
  return authUrl + '?' + params.toString()
}

function getRandomState() {
  const key = 'sunny-' + Math.random().toString(36).slice(2)
  localStorage.setItem('gh-salt', key)
  return key
}

function saveAccessInfo(acc) {
  const tt = typeof acc === 'string' ? acc : JSON.stringify(acc)
  localStorage.setItem('gh-acc', btoa(tt))
}

/** return {access_token, token_type, scope}  */
function getAccessInfo () { 
  const acc = localStorage.getItem('gh-acc')
  if (!acc) return null
  return JSON.parse(atob(acc))
}

function getAccessToken () {
  const info = getAccessInfo()
  return info ? info.access_token : ''
}