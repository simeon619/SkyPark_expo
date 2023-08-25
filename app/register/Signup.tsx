import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as z from 'zod';
import { horizontalScale, moderateScale, verticalScale } from '../../Utilis/metrics';
import { TextBold, TextRegular, TextSemiBold } from '../../components/StyledText';
import { ScrollView, View } from '../../components/Themed';
import { Input } from '../../components/register/input';
import createButton from '../../components/utilis/simpleComponent/createButton';

const schema = z
  .object({
    email: z.string().email({ message: 'Votre email non valide' }),
    password: z.string().min(2, { message: 'Votre mot de passe doit contenir au moins 6 caractères' }),
    confirmedPassword: z.string().min(1, { message: 'Veuillez confirmez votre mot de passe' }),
    code: z.string().min(4, { message: 'Le code doit avoir 4 caractères' }),
  })
  .refine((data) => data.password === data.confirmedPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmedPassword'],
  })
  .refine((data) => data.code === '1222', {
    message: "Le code n'est pas valide",
    path: ['code'],
  });
export type ValidationSchema = z.infer<typeof schema>;
const Signup = () => {
  const { height } = useWindowDimensions();

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ValidationSchema>({ mode: 'onSubmit', resolver: zodResolver(schema) });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FCF3F3' }}>
      <ScrollView lightColor="#FCF3F3" darkColor="#FCF3F3" style={{ flex: 1, paddingHorizontal: horizontalScale(20) }}>
        <View lightColor="#FCF3F3" darkColor="#FCF3F3" style={{ marginTop: height * 0.12 }}>
          <TextSemiBold style={{ fontSize: moderateScale(16), letterSpacing: 2 }}>
            Bienvenue sur le réseau social
          </TextSemiBold>
          <TextBold style={{ fontSize: moderateScale(16) }}>Skypark</TextBold>
          <TextRegular style={{ fontSize: moderateScale(15) }}>Veuillez créer votre compte</TextRegular>
          <View lightColor="#FCF3F3" darkColor="#FCF3F3" style={{ marginTop: height * 0.05 }}>
            <Input
              control={control}
              placeholder="Entrez votre adresse email"
              name="email"
              securePassword={false}
              defaultyValue="u1@gmail.com"
              register={register}
              errors={errors}
            />
            <Input
              control={control}
              placeholder="Entrez votre mot de passe"
              name="password"
              securePassword={true}
              defaultyValue="u1"
              register={register}
              errors={errors}
            />
            <Input
              control={control}
              placeholder="Confirmez votre mot de passe"
              name="confirmedPassword"
              securePassword={true}
              defaultyValue="u1"
              register={register}
              errors={errors}
            />
            <Input
              control={control}
              placeholder="Entrez votre code"
              name="code"
              securePassword={false}
              defaultyValue="8520"
              register={register}
              errors={errors}
            />
          </View>
        </View>
      </ScrollView>
      <View lightColor="#0000" darkColor="#0000" style={{ position: 'absolute', bottom: verticalScale(-75) }}>
        {createButton({
          value: 'inscription',
          onPress: handleSubmit,
          style: {
            alignSelf: 'flex-end',
            zIndex: 99,
            position: 'absolute',
            top: verticalScale(40),
            right: horizontalScale(35),
          },
        })}
        <Image
          source={require('../../assets/images/Vector.svg')}
          style={{ width: 375, height: 272 }}
          contentFit="contain"
        />
      </View>
    </SafeAreaView>
  );
};

export default Signup;
