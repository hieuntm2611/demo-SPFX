import * as React from 'react'
import { Stack } from '@fluentui/react';
import { TextField } from '@fluentui/react/lib/TextField';
import { ChoiceGroup, IChoiceGroupOption } from '@fluentui/react/lib/ChoiceGroup';
import styles from './IqTest.module.scss';

interface IQuestionFormatProps {
    Question: any;
    updateAnswer: any
    currentAnswer: any
}
interface IQuestionFormatState {
    optionsSingleChoice: Array<any>;
}
export default class QuestionFormat extends React.Component<IQuestionFormatProps, IQuestionFormatState> {
    constructor(props: IQuestionFormatProps | Readonly<IQuestionFormatProps>) {
        super(props);
        this.state = {
            optionsSingleChoice: [],
        }

    }
    public componentDidMount(): void {
        if (this.props.Question.ListAnswer && this.props.Question.QuizType == "Singlechoice") {
            const choice: IChoiceGroupOption[] = []
            const array = this.props.Question.ListAnswer.filter((x: any) => x.id = this.props.Question.id)
            array.forEach((item: any) => {
                choice.push(
                    {
                        key: item.key,
                        text: item.text
                    }
                )
            });
            this.setState({ optionsSingleChoice: choice })
        }

    }
    public render(): React.ReactElement<IQuestionFormatProps> {
        switch (this.props.Question.QuizType) {
            case "Text":
                return (
                    <div>
                        <Stack className={styles.boldText}>
                            Question {this.props.Question.id}:
                        </Stack>
                        <Stack className={styles.boldText}>
                            {this.props.Question.Question}
                        </Stack>
                        <Stack>
                            <TextField label="Answer: " onChange={this.SetTextValue.bind(this)} />
                        </Stack>
                    </div>
                )
            case "Singlechoice":
                return (
                    <div>
                        <Stack className={styles.boldText}>
                            Question {this.props.Question.id}:
                        </Stack>
                        <Stack>
                            <ChoiceGroup options={this.state.optionsSingleChoice} onChange={this.SingleChoiceChange.bind(this)} label={this.props.Question.Question} />
                        </Stack>
                    </div>
                )
        }
    }
    private SetTextValue = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newvalue?: string) => {
        this.props.updateAnswer(this.props.Question.id, newvalue)
    }
    private SingleChoiceChange = (ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption): void => {
        this.props.updateAnswer(this.props.Question.id, option.key)
    }
}