import * as React from 'react';
import styles from './IqTest.module.scss';
import { IIqTestProps } from './IIqTestProps';
import RESTOperation from '../../../Common/RESTOperation'
import { DatePicker, getTheme, mergeStyleSets, FontWeights, ContextualMenu, Toggle, Modal, IDragOptions, IIconProps, IStackTokens, Stack, IStackProps, IStackStyles } from '@fluentui/react';
import { DefaultButton, IconButton, IButtonStyles, PrimaryButton } from '@fluentui/react/lib/Button';
import QuestionFormat from './QuestionFormat';
import { sp } from '@pnp/sp/presets/all'
import { TextField } from '@fluentui/react/lib/TextField';
import * as moment from 'moment';
interface IIqTestState {
  isModalOpen: boolean;
  Answer: Array<any>
  UserName: any
  UserPersonalEmail: any
  UserAddress: any
  UserPhoneNumber: any
  Dob: any
  StartTime: any
  point: any
}
const theme = getTheme();
const contentStyles = mergeStyleSets({
  container: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
  },
  header: [
    theme.fonts.xLargePlus,
    {
      flex: '1 1 auto',
      borderTop: `4px solid ${theme.palette.themePrimary}`,
      color: theme.palette.neutralPrimary,
      display: 'flex',
      alignItems: 'center',
      fontWeight: FontWeights.semibold,
      padding: '12px 12px 14px 24px',
    },
  ],
  heading: {
    color: theme.palette.neutralPrimary,
    fontWeight: FontWeights.semibold,
    fontSize: 'inherit',
    margin: '0',
  },
  body: {
    padding: '0 24px 24px 24px',
    overflowY: 'hidden',
  },
});
const iconButtonStyles: Partial<IButtonStyles> = {
  root: {
    color: theme.palette.neutralPrimary,
    marginLeft: 'auto',
    marginTop: '4px',
    marginRight: '2px',
  },
  rootHovered: {
    color: theme.palette.neutralDark,
  },
};
const columnProps: Partial<IStackProps> = {
  tokens: { childrenGap: 15 },
  styles: { root: { width: 300 } },
};
const stackTokens: Partial<IStackTokens> = { childrenGap: 20 };
const stackStyles: Partial<IStackStyles> = { root: { width: 650 } };
const cancelIcon: IIconProps = { iconName: 'Cancel' };

export default class IqTest extends React.Component<IIqTestProps, IIqTestState> {

  private listQuestion: Array<any> = [];
  constructor(props: IIqTestProps | Readonly<IIqTestProps>) {
    super(props);
    sp.setup({
      sp: {
        baseUrl: this.props.context.pageContext.web.absoluteUrl,
      }
    })
    this.state = {
      isModalOpen: false,
      Answer: [],
      UserName: '',
      UserPersonalEmail: '',
      UserAddress: '',
      UserPhoneNumber: '',
      Dob: '',
      StartTime: '',
      point: ''
    }
  }

  public componentDidMount() {
    RESTOperation.getQuiz(this.props.context, this.props.QuestionList).then(items => {
      console.log(items.value)
      let optionsSingleChoice: Array<any> = [];
      const Answer = []
      for (let i = 0; i < items.value.length; i++) {
        const element = items.value[i];
        if (element.ListAnswer) {
          element.ListAnswer?.split("-").map((item: any) => {
            if (element.QuizType == "Singlechoice") {
              optionsSingleChoice.push(
                {
                  id: (i + 1).toString(),
                  key: item.trim(),
                  text: item.trim()
                }
              )
            }
          })
        }
        let arraySingle = optionsSingleChoice
        if (element.QuizType == "Singlechoice") {
          this.listQuestion.push({
            id: (i + 1).toString(),
            QuizType: element.QuizType,
            Question: element.Question,
            CorrectAnswer: element.CorrectAnswer,
            ListAnswer: arraySingle,
          })
        } else if (element.QuizType == "Text") {
          this.listQuestion.push({
            id: (i + 1).toString(),
            QuizType: element.QuizType,
            Question: element.Question,
            CorrectAnswer: element.CorrectAnswer,
            ListAnswer: [],
          })
        }

        optionsSingleChoice = []
        Answer.push(
          {
            question: (i + 1).toString(),
            answer: ""
          }
        )
      }
      this.setState({ Answer: Answer })
    })
  }

  public render(): React.ReactElement<IIqTestProps> {


    return (
      <div className={styles.container}>
        <Stack horizontal tokens={stackTokens} styles={stackStyles} className={styles.bodytop}>
          <Stack {...columnProps}>
            <TextField label="User Name" onChange={this.setUserName.bind(this)} defaultValue={this.state.UserName} required />
            <TextField label="Address" onChange={this.setUserAddress.bind(this)} defaultValue={this.state.UserAddress} required />
            <DatePicker
              label='Date of birth'
              ariaLabel="Select a date"
              onSelectDate={this.setDob.bind(this)}
              isRequired={true}
            />
          </Stack>
          <Stack {...columnProps}>
            <TextField label="Email" onChange={this.setUserPersonalEmail.bind(this)} defaultValue={this.state.UserPersonalEmail} required />
            <TextField label="Phone Number" onChange={this.setUserPhoneNumber.bind(this)} defaultValue={this.state.UserPhoneNumber} required />
          </Stack>
        </Stack>
        <Stack className={styles.alignItem}>
          <PrimaryButton onClick={() => this.showModal()} text="Start Test" />
        </Stack>
        <Modal
          isOpen={this.state.isModalOpen}
          onDismiss={() => this.hideModal()}
          isBlocking={false}
          dragOptions={undefined}
          containerClassName={contentStyles.container}
        >
          <div className={contentStyles.header}>
            <h2 className={contentStyles.heading} >
              Testing
            </h2>
            <IconButton
              styles={iconButtonStyles}
              iconProps={cancelIcon}
              ariaLabel="Close popup modal"
              onClick={() => this.hideModal()}
            />
          </div>
          <div className={contentStyles.body}>
            <Stack >
              {
                this.listQuestion.map(question => {
                  return (
                    <div>

                      <QuestionFormat Question={question} updateAnswer={this.updateAnswer} currentAnswer={this.state.Answer} />
                      <br />
                    </div>
                  )

                })
              }
            </Stack>
            <Stack className={styles.middleStack}>
              <PrimaryButton onClick={() => this.submitAnswer()} text="Submit" />
            </Stack>
          </div>
        </Modal>
      </div >
    );
  }
  private async submitAnswer() {
    let totalPoint = 0
    let answer = ''
    this.state.Answer.forEach(item => {
      this.listQuestion.forEach(question => {
        if (item.question === question.id) {
          if (item.answer === question.CorrectAnswer) {
            totalPoint++
          }
        }
      });
      answer += item.answer + ", "
    });
    answer = answer.substring(0, answer.length - 2);
    let event = new Date();
    let _body = {
      Title: this.state.UserName + " - " + event.toLocaleString(),
      TotalPoint: totalPoint.toString(),
      Answer: answer,
      StartTime: this.state.StartTime,
      EndTime: event.toLocaleTimeString(),
      QuizList: this.props.QuestionList,
    }
    this.setState({ point: totalPoint.toString() })
    return sp.web.lists.getByTitle('AnswersDetail').items.add(_body).then(i => {
      this.setState({ isModalOpen: false })
      setTimeout(function () {
        alert('Thank you for submitting the quiz. Your responses have been received. Your point is ' + _body.TotalPoint);
        window.location.reload();
      }, 1000)
    })
  }
  private showModal() {
    let startTime = new Date();
    this.setState({ isModalOpen: true, StartTime: startTime.toLocaleTimeString() })
    let body = {
      Title: this.state.UserName,
      UserPersonalEmail: this.state.UserPersonalEmail,
      UserPhoneNumber: this.state.UserPhoneNumber,
      DoB: this.state.Dob,
      UserAddress: this.state.UserAddress,
    }
    return sp.web.lists.getByTitle('UserInformation').items.add(body)
  }

  private hideModal() {
    this.setState({ isModalOpen: false })
  }
  private updateAnswer = (Question: any, value: any) => {
    const Answer = this.state.Answer
    Answer.forEach(item => {
      if (item.question == Question) {
        item.answer = value
      }
    });
    this.setState({ Answer: Answer })
    console.log(this.state.Answer)
  }
  private setUserName = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
    this.setState({ UserName: newValue })
  }
  private setUserPersonalEmail = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
    this.setState({ UserPersonalEmail: newValue })
  }
  private setUserAddress = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
    this.setState({ UserAddress: newValue })
  }
  private setUserPhoneNumber = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
    this.setState({ UserPhoneNumber: newValue })
  }
  private setDob = (date: Date | null | undefined): void => {
    if ((date != undefined) || (date != null)) {
      var dateValue = moment(date).format('YYYY-MM-DDTHH:mm:ss')
      this.setState({ Dob: dateValue })
    }
  }
}