import mongoose from 'mongoose';

const comentarioSchema = new mongoose.Schema({
  receita_id: {
    type: Number,
    required: true,
  },
  nome: {
    type: String,
    required: true,
  },
  texto: {
    type: String,
    required: true,
  },
});

const Comentario = mongoose.model('Comentario', comentarioSchema);

export default Comentario;
