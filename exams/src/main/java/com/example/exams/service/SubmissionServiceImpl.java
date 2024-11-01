package com.example.exams.service;

import com.example.exams.domain.QUESTION_TYPE;
import com.example.exams.model.*;
import com.example.exams.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class SubmissionServiceImpl implements SubmissionService {

    @Autowired
    private SubmissionRepository submissionRepository;


    @Override
    public Submission findSubmissionById(long id) throws Exception {
        Submission submission = submissionRepository.findById(id);
        if(submission == null){
            throw new Exception("Submission not found");
        }
        return submission;
    }

    @Override
    public List<Submission> getSubmissionsForStudent(String username) {
        return submissionRepository.findByStudentUsername(username);
    }

    @Override
    public List<Submission> getSubmissionsForExam(Exam exam) {
        return submissionRepository.findByExam(exam);
    }

    @Override
    public Submission submitExam(Submission submission) {
        return submissionRepository.save(submission);
    }

    @Override
    public Submission gradeExam(Submission submission, Map<Integer, Double> typicalQuestionScores) throws Exception {
        List<Question> questions = submission.getExam().getQuestionList();
        List<String> answers = submission.getAnswersList();
        double examScore = 0;

        for(int i = 0; i < questions.size(); i++){
            Question question = questions.get(i);
            String answer = answers.get(i);
            String correct_answer = question.getCorrectAnswer();

            switch (question.getQuestionType()){
                case TYPE_MCQ:
                    MultipleChoiceQuestion mcq = (MultipleChoiceQuestion) question;
                    checkForValidAnswer(answer, mcq);
                    if (correct_answer.equals(answer)){
                        examScore += mcq.getScore();
                    } else if (mcq.isNegative()){
                        examScore -= mcq.getNegativeScore();
                    }
                    break;
                case TYPE_TF:
                    TrueOrFalseQuestion tfq = (TrueOrFalseQuestion) question;
                    checkForValidAnswer(answer, tfq);
                    if (correct_answer.equals(answer)){
                        examScore += tfq.getScore();
                    } else if (tfq.isNegative()){
                        examScore -= tfq.getNegativeScore();
                    }
                    break;
                default:
                    TypicalQuestion tq = (TypicalQuestion) question;
                    for(Map.Entry<Integer, Double> entry : typicalQuestionScores.entrySet()){
                        int questionIndex = entry.getKey();
                        double score = entry.getValue();

                        if(questions.get(questionIndex).equals(question)){
                            if(!tq.isGraded()){
                                examScore += score;
                                tq.setGraded(true);
                            }
                        }
                    }
            }
        }
        submission.setScore(examScore);
        return submissionRepository.save(submission);
    }

    private void checkForValidAnswer(String answer, Question q) throws Exception {
        if (q instanceof MultipleChoiceQuestion) {
            if (!(answer.equals("a") || answer.equals("b")
                    || answer.equals("c") || answer.equals("d"))) {
                throw new Exception("Invalid answer");
            }
        } else{
            if (!(answer.equals("true") || answer.equals("false"))){
                throw new Exception("Invalid answer");
            }
        }
    }
}
