import React from 'react';
import api from '../utils/Api';
import {CurrentUserContext} from '../contexts/CurrentUserContext';
import PopupWithForm from './PopupWithForm';
import InputWithErrorControlled from './InputWithErrorControlled';

export default React.memo(function EditProfilePopup(props) {

  const currentUser = React.useContext(CurrentUserContext);

  return (
    <PopupWithForm
      {...props}
      name="edit-profile"
      title="Редактировать профиль"
      buttonText="Сохранить"
      buttonRequestText="Сохранение"
      submitRequest={api.editProfile.bind(api)}
    >
      <InputWithErrorControlled name="name" type="text" placeholder="Имя" minLength="2" maxLength="40" required >
        {currentUser && currentUser.name}
      </InputWithErrorControlled>
      <InputWithErrorControlled name="about" type="text" placeholder="О себе" minLength="2" maxLength="200" required>
        {currentUser && currentUser.about}
      </InputWithErrorControlled>
    </PopupWithForm>
  );
});
