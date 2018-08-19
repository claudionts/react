import { listagem, 
		 comentario, 
		 like, 
		 notifica } from './../actions/actionCreator'

export default class TimeLineApi {
	static lista(urlPerfil) {
		return dispatch => {
			fetch(urlPerfil)
      .then(response => response.json())
      .then(fotos => {
			dispatch(listagem(fotos))
			return fotos
      });
		}
	}

	static comenta(fotoId, textoComentario) {
		return dispatch => {
			const requestInfo = {
				method: 'POST',
				body: JSON.stringify({texto:textoComentario}),
				headers: new Headers({
					'Content-type':'application/json'
				})
			}
			fetch(`http://instalura-api.herokuapp.com/api/fotos/${fotoId}/comment?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, requestInfo)
				.then(response => {
					if(response.ok) {
						return response.json()
					} else {
						throw new Error("não foi possivel comentar")
					}
				})
				.then(novoComentario => {
					dispatch(comentario(fotoId, novoComentario))
				})
		}
  	}

	static like(fotoId) {
		return dispatch => {
			fetch(`http://instalura-api.herokuapp.com/api/fotos/${fotoId}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, {method: 'POST'})
				.then(response => {
					if(response.ok) {
						return response.json()
					} else {
						throw new Error('Não foi possivel realizar o like da foto')
					}
				})
				.then(liker => {
					dispatch(like(fotoId, liker))
					return liker
				})
		}
	}

	static pesquisa(login){
		return dispatch => {
			fetch(`http://instalura-api.herokuapp.com/api/public/fotos/${login}`)
				.then(response => response.json())
				.then(fotos => {
					if(fotos.length === 0) {
						dispatch(notifica('Usuário não encontrado'))
					} else {
						dispatch(notifica('usuario encontrado'))
					}
					dispatch(listagem(fotos))
					return fotos
				})
		}
	}
}