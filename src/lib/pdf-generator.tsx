/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { Question, UserSession } from './types';

// Register fonts if needed, for now using standard
// Font.register({ family: 'Inter', src: '...' });

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFF',
        padding: 30,
    },
    header: {
        marginBottom: 20,
        textAlign: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
        color: '#FFD1DC',
    },
    subtitle: {
        fontSize: 12,
        color: '#666',
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
    question: {
        fontSize: 14,
        marginBottom: 5,
        color: '#333',
        fontWeight: 'bold',
    },
    answer: {
        fontSize: 12,
        marginBottom: 15,
        color: '#555',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginBottom: 10,
    }
});

interface PDFLayoutProps {
    session: UserSession;
    questions: Question[];
}

export const PDFLayout = ({ session, questions }: PDFLayoutProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.title}>Our Date Plan ❤️</Text>
                <Text style={styles.subtitle}>Created on {new Date(session.startedAt).toLocaleDateString()}</Text>
            </View>

            <View style={styles.section}>
                {questions.map((q) => {
                    const answerValue = session.answers[q.id];
                    let displayAnswer = answerValue;
                    let imageUrl = null;

                    if (q.options) {
                        const selectedOption = q.options.find(opt => opt.value === answerValue);
                        if (selectedOption) {
                            displayAnswer = selectedOption.label;
                            // In a real generic implementation we might want to show the selected image too
                            // if (selectedOption.imageUrl) imageUrl = selectedOption.imageUrl;
                        }
                    }

                    return (
                        <View key={q.id}>
                            <Text style={styles.question}>{q.text}</Text>
                            {/* {imageUrl && <Image src={imageUrl} style={styles.image} />} */}
                            <Text style={styles.answer}>{Array.isArray(displayAnswer) ? displayAnswer.join(', ') : displayAnswer || "No answer"}</Text>
                        </View>
                    );
                })}
            </View>

            <View style={{ marginTop: 'auto', borderTopWidth: 1, borderColor: '#eee', paddingTop: 10 }}>
                <Text style={{ fontSize: 10, textAlign: 'center', color: '#999' }}>
                    Generated with love by your Preference Picker App
                </Text>
            </View>
        </Page>
    </Document>
);
