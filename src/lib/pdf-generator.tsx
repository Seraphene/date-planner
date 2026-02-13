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
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 30,
        textAlign: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#FFD1DC',
        paddingBottom: 20,
    },
    title: {
        fontSize: 28,
        marginBottom: 10,
        color: '#FF8FAB', // Darker pink for text
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 12,
        color: '#888',
        fontStyle: 'italic',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%', // 2 columns
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#FFF5F7', // Very light pink bg
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FFD1DC',
    },
    textCard: {
        width: '100%',
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#F0F9FF', // Light blue for text answers
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#BAE6FD',
    },
    questionText: {
        fontSize: 14,
        marginBottom: 8,
        color: '#444',
        fontWeight: 'bold',
    },
    answerText: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
    imageContainer: {
        width: '100%',
        height: 150,
        marginBottom: 10,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#eee',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    footer: {
        marginTop: 'auto',
        borderTopWidth: 1,
        borderColor: '#eee',
        paddingTop: 10,
        textAlign: 'center',
    },
    footerText: {
        fontSize: 10,
        color: '#999',
    },
});

interface PDFLayoutProps {
    session: UserSession;
    questions: Question[];
}

export const PDFLayout = ({ session, questions }: PDFLayoutProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.title}>Our Perfect Date Plan ❤️</Text>
                <Text style={styles.subtitle}>Created on {new Date(session.startedAt).toLocaleDateString()}</Text>
            </View>

            <View style={styles.grid}>
                {questions.map((q) => {
                    const answerValue = session.answers[q.id];
                    let displayLabel = String(answerValue);
                    let displayImage = null;

                    // Find selected option details if available
                    if (q.options) {
                        const selected = q.options.find(opt => opt.value === answerValue);
                        if (selected) {
                            displayLabel = selected.label;
                            if (selected.imageUrl) {
                                displayImage = selected.imageUrl;
                            }
                        }
                    }

                    // Render Grid Card for Image/Selection types
                    if (q.type === 'binary' || q.type === 'selection') {
                        return (
                            <View key={q.id} style={styles.card}>
                                <Text style={styles.questionText}>{q.text}</Text>
                                {displayImage && (
                                    <View style={styles.imageContainer}>
                                        <Image src={displayImage} style={styles.image} />
                                    </View>
                                )}
                                <Text style={styles.answerText}>✨ {displayLabel}</Text>
                            </View>
                        );
                    }

                    // Render Full Width Card for Text types
                    return (
                        <View key={q.id} style={styles.textCard}>
                            <Text style={styles.questionText}>{q.text}</Text>
                            <Text style={styles.answerText}>"{displayLabel}"</Text>
                        </View>
                    );
                })}
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Generated with love by your Date Planner App
                </Text>
            </View>
        </Page>
    </Document>
);
