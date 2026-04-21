import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {UrlManager} from "./utils/url-manager.js";
import {Auth} from "../services/auth.js";

export class Answers {
    constructor() {
        this.answersTextElement = null;
        this.answers = null;
        this.quiz = null;
        this.routeParams = UrlManager.getQueryParams();
        this.userInfo = Auth.getUserInfo();

        this.init();
    }

    async init() {

        if (this.routeParams.id && this.userInfo.userId) {
            try {
                const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id +
                    '/result/details?userId=' + this.userInfo.userId);
                if (result) {
                    if (result.error) {
                        throw new Error(result.error);
                    }

                    this.quiz = result.test;
                    this.showAnswers();
                }
            } catch (error) {
                console.log(error);
            }
        }
    }


    showAnswers() {

        // Шапка
        document.getElementById('test-name').innerText = this.quiz.name;
        const fullName = this.userInfo.fullName;
        const email = this.userInfo.email;
        document.getElementById('user').innerText = `${fullName}, ${email}`;

        this.answersTextElement = document.getElementById('answers-text');
        this.answersTextElement.innerHTML = '';

        // Вопросы
        this.quiz.questions.forEach((quest, index) => {
            // Контейнер для одного вопроса
            const questionBlock = document.createElement('div');
            questionBlock.className = 'answers-question';

            // Заголовок вопроса
            const titleElement = document.createElement('div');
            titleElement.className = 'question-title';
            titleElement.innerHTML = `<span>Вопрос ${index + 1}:</span> ${quest.question}`;
            questionBlock.appendChild(titleElement);

            // Контейнер для вариантов ответов
            const optionsElement = document.createElement('div');
            optionsElement.className = 'question-options';


            // Ответы внутри текущего вопроса
            quest.answers.forEach(answer => {
                const optionElement = document.createElement('div');
                optionElement.className = 'question-option';

                //Input
                const inputId = 'answer-' + answer.id;
                const inputElement = document.createElement('input');
                inputElement.setAttribute('id', inputId);
                inputElement.setAttribute('type', 'radio');
                inputElement.setAttribute('name', 'answer-' + quest.id);

                //Label
                const labelElement = document.createElement('label');
                labelElement.setAttribute('for', inputId);
                labelElement.innerText = answer.answer;

                //Пользователь выбрал этот ответ
                if (answer.correct !== undefined) {
                    if (answer.correct === true) {
                        labelElement.style.color = '#5FDC33';
                        inputElement.style.border = '6px solid #59AC49';
                    } else if (answer.correct === false) {
                        labelElement.style.color = '#DC3333';
                        inputElement.style.border = '6px solid #DC3333';
                    }
                }

                optionElement.appendChild(inputElement);
                optionElement.appendChild(labelElement);
                optionsElement.appendChild(optionElement);
            });

            questionBlock.appendChild(optionsElement);


            this.answersTextElement.appendChild(questionBlock);
        });
        document.getElementById('link-result').href = '#/result?id=' + this.routeParams.id;;
    }
}
