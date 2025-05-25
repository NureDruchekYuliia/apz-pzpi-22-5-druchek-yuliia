package com.example.sleepmonitorapp.data.network

import com.example.sleepmonitorapp.data.model.*
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.Path

interface ApiService {
    @POST("account/login")
    fun login(@Body loginRequest: LoginRequest): Call<LoginResponse>

    @POST("account/register")
    fun register(@Body request: RegisterRequest): Call<Void>

    @GET("sleeprecord")
    suspend fun getAllRecords(): List<SleepRecord>

    @GET("sleeprecord/date/{date}")
    suspend fun getRecordsByDate(@Path("date") date: String): List<SleepRecord>

    @GET("sleeprecord/{id}")
    suspend fun getRecordById(@Path("id") id: String): SleepRecord

    @GET("sleeprecord/recommendations/{id}")
    suspend fun getRecommendations(@Path("id") id: String): List<Recommendation>

    @DELETE("sleeprecord/{id}")
    suspend fun deleteRecord(@Path("id") id: String): Response<Unit>

    @POST("sleeprecord")
    suspend fun addSleepRecord(@Body record: SleepRecordRequest)

    @PATCH("sleeprecord/{id}")
    suspend fun updateRecord(
        @Path("id") id: String,
        @Body request: SleepRecordRequest
    ): Response<ResponseBody>
}
