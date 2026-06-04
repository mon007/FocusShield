import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { Colors } from '../theme/colors';

type Props = {
  name: string;
  showRemove?: boolean;
  onRemove?: () => void;
};

export default function AppCard({
  name,
  showRemove = false,
  onRemove,
}: Props) {
  return (
    <View
      style={[
        styles.container,
      ]}>

      <View style={styles.row}>
        <View style={styles.leftSection}>
          <Text style={styles.text}>
            {name}
          </Text>
        </View>

        {showRemove && (
          <TouchableOpacity
            onPress={onRemove}>
            <Text
              style={
                styles.removeText
              }>
              ✕
            </Text>
          </TouchableOpacity>
        )}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: Colors.primaryLight,
    borderRadius: 12
  },


  separator: {
    height: 1,
    backgroundColor: '#ECECEC',
    marginTop: 18,
  },

  row: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 12,
  },

  checkboxSelected: {
    backgroundColor: Colors.primary,
  },

  text: {
    fontSize: 16,
    fontWeight: '600',
  },

  removeText: {
    fontSize: 12,
    fontWeight: '700',
  },
});