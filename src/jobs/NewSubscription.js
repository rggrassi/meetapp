const { sendMail } = require('../lib/Mail');
const { format, parseISO } = require('date-fns');
const ptBr = require('date-fns/locale/pt-BR');

const key = 'NewSubscription';

const handle = async ({ data }) => {
    const { meetup, user } = data;
    const formatDate = format(parseISO(meetup.date), "'dia' dd 'de' MMMM', às' H:mm'h'", { locale: ptBr });
    await sendMail({
        to: `${meetup.user.name} <${meetup.user.email}>`,
        subject: 'Nova inscrição',
        template: 'subscription',
        context: {
            organizer: meetup.user.name,
            user: user.name,
            meetup: `${meetup.title} - ${formatDate}`
        }
    })        
}

export default { key, handle }