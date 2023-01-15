import React from 'react';
import api from '../utils/Api';
import PopupWithForm from './PopupWithForm';
import InputWithError from './InputWithError';

export default React.memo(function EditAvatarPopup(props) {
  return (
    <PopupWithForm
      {...props}
      name="change-avatar"
      title="Обновить аватар"
      buttonText="Сохранить"
      buttonRequestText="Сохранение"
      submitRequest={api.setAvatar.bind(api)}
    >
      <InputWithError name="avatar" type="url" placeholder="Ссылка на фото" required />
  </PopupWithForm>
  );
});
