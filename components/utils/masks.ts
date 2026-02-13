/**
 * Utilitários para máscaras de entrada
 */

export const maskPhone = (value: string) => {
    return value
        .replace(/\D/g, '') // Remove tudo que não é dígito
        .replace(/(\d{2})(\d)/, '($1) $2') // Coloca parênteses em volta dos dois primeiros dígitos
        .replace(/(\d{5})(\d)/, '$1-$2') // Coloca hífen após os 5 dígitos do celular
        .replace(/(-\d{4})\d+?$/, '$1'); // Limita o tamanho
};
