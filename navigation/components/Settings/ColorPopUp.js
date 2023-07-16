import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

const colors = [
  '#6874e7',
  '#b8304f',
  '#758E4F',
  '#fa3741',
  '#F26419',
  '#F6AE2D',
  '#DFAEB4',
  '#7A93AC',
  '#33658A',
  '#3d2b56',
  '#42273B',
  '#171A21',
];

const CIRCLE_SIZE = 40;
const CIRCLE_RING_SIZE = 2;


export default function Example() {
  const [value, setValue] = React.useState(0);
  const sheet = React.useRef();

  React.useEffect(() => {
    sheet.current.open();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.placeholder}>
        <View style={styles.placeholderInset}>
          {/* Replace with your content */}
        </View>
      </View>

      <RBSheet
        customStyles={{ container: styles.sheet }}
        height={440}
        openDuration={250}
        ref={sheet}>
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetHeaderTitle}>Select profile color</Text>
        </View>
        <View style={styles.sheetBody}>
          <View style={[styles.profile, { backgroundColor: colors[value] }]}>
            <Text style={styles.profileText}>MB</Text>
          </View>
          <View style={styles.group}>
            {colors.map((item, index) => {
              const isActive = value === index;
              return (
                <View key={item}>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      setValue(index);
                    }}>
                    <View
                      style={[
                        styles.circle,
                        isActive && { borderColor: item },
                      ]}>
                      <View
                        style={[styles.circleInside, { backgroundColor: item }]}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              );
            })}
          </View>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              // handle onPress
            }}>
            <Text style={styles.btnText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sheetHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  sheetHeaderTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  sheetBody: {
    padding: 24,
  },
  profile: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  profileText: {
    fontSize: 34,
    fontWeight: '600',
    color: 'white',
  },
  group: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  circle: {
    width: CIRCLE_SIZE + CIRCLE_RING_SIZE * 4,
    height: CIRCLE_SIZE + CIRCLE_RING_SIZE * 4,
    borderRadius: 9999,
    backgroundColor: 'white',
    borderWidth: CIRCLE_RING_SIZE,
    borderColor: 'transparent',
    marginRight: 8,
    marginBottom: 12,
  },
  circleInside: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: 9999,
    position: 'absolute',
    top: CIRCLE_RING_SIZE,
    left: CIRCLE_RING_SIZE,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    padding: 14,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#000',
    marginBottom: 12,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  container: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  sheet: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  placeholder: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    height: 400,
    marginTop: 0,
    padding: 24,
  },
  placeholderInset: {
    borderWidth: 4,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 9,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
});