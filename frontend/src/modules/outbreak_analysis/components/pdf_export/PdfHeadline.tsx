import { Text } from "@react-pdf/renderer";

export const Headline = ({ level, children }: { level: number; children: any }) => {
    switch (level) {
        case 1:
            return <Text style={{ fontSize: 16, fontWeight: 400, marginBottom: 10 }}>{children}</Text>;
        case 2:
            return <Text style={{ fontSize: 14, fontWeight: 300, marginVertical: 10 }}>{children}</Text>;
        default:
            return <Text style={{ fontSize: 12, fontWeight: 400, marginVertical: 10 }}>{children}</Text>;
    }
};
